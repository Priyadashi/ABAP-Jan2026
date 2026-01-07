"""
ABAP Agent MVP - n8n Webhook Backend
Provides API endpoints for n8n workflow integration
"""
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os

from config import settings
from n8n_client import N8nWorkflowClient

# Initialize FastAPI app
app = FastAPI(
    title="ABAP Agent API (n8n)",
    description="Backend API for ABAP Code Generation via n8n Workflow",
    version="1.0.0",
)

# Configure CORS (same as original)
cors_origins = settings.cors_origins.split(",")
allow_all_origins = os.getenv("ENVIRONMENT", "development") == "development"

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if not allow_all_origins else [
        "http://localhost:5173", 
        "http://localhost:3000", 
        "http://127.0.0.1:5173", 
        "http://127.0.0.1:3000", 
        "http://localhost:5174", 
        "http://127.0.0.1:5174"
    ],
    allow_origin_regex=r"https://.*-5173\.app\.github\.dev" if allow_all_origins else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize n8n client
n8n_client = N8nWorkflowClient()


# Response Models
class UploadResponse(BaseModel):
    """Response model for file upload"""
    success: bool
    filename: str
    content: str
    error: Optional[str] = None


class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str
    service: str
    version: str
    n8n_webhook: str


# API Endpoints
@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        service="ABAP Agent API (n8n)",
        version="1.0.0",
        n8n_webhook=settings.n8n_webhook_url[:50] + "..."
    )


@app.get("/api/health")
async def health_check():
    """Detailed health check including n8n connectivity"""
    n8n_reachable = await n8n_client.health_check()
    return {
        "status": "healthy",
        "n8n_webhook_configured": bool(settings.n8n_webhook_url),
        "n8n_reachable": n8n_reachable
    }


@app.post("/api/upload", response_model=UploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    message: Optional[str] = Form(None),
):
    """
    Upload a file to the n8n workflow for processing.
    The file is sent directly to the n8n webhook as form-data.
    """
    try:
        # Validate file type
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in settings.allowed_file_types:
            raise HTTPException(
                status_code=400,
                detail=f"File type {file_ext} not allowed. Allowed types: {settings.allowed_file_types}",
            )

        # Read file content
        file_content = await file.read()

        # Check file size
        if len(file_content) > settings.max_file_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Max size: {settings.max_file_size} bytes",
            )

        # Prepare additional data if message provided
        additional_data = {}
        if message:
            additional_data["message"] = message

        # Send to n8n workflow
        result = await n8n_client.send_file_to_workflow(
            file_content=file_content,
            filename=file.filename,
            additional_data=additional_data if additional_data else None
        )

        return UploadResponse(
            success=result.get("success", False),
            filename=file.filename,
            content=result.get("content", "No response from workflow"),
            error=result.get("error")
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.api_host, port=settings.api_port)
