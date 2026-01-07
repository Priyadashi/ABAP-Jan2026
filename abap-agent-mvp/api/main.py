"""
ABAP Agent MVP - FastAPI Backend
Provides API endpoints for OpenAI Assistant interaction
"""
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os

from config import settings
from openai_client import OpenAIAssistantClient
from utils import get_file_content_as_text

# Initialize FastAPI app
app = FastAPI(
    title="ABAP Agent API",
    description="Backend API for ABAP Code Generation Assistant",
    version="1.0.0",
)

# Configure CORS
# In development/Codespaces, allow all origins. In production, use specific origins.
cors_origins = settings.cors_origins.split(",")
allow_all_origins = os.getenv("ENVIRONMENT", "development") == "development"

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if not allow_all_origins else ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_origin_regex=r"https://.*-5173\.app\.github\.dev" if allow_all_origins else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
openai_client = OpenAIAssistantClient()


# Request/Response Models
class ChatRequest(BaseModel):
    """Request model for chat endpoint"""

    thread_id: Optional[str] = None
    message: str
    ricef_type: Optional[str] = None


class ChatResponse(BaseModel):
    """Response model for chat endpoint"""

    thread_id: str
    message_id: str
    content: str
    role: str


class ThreadResponse(BaseModel):
    """Response model for thread creation"""

    thread_id: str


class MessageResponse(BaseModel):
    """Response model for individual messages"""

    id: str
    role: str
    content: str
    created_at: int


# API Endpoints
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ABAP Agent API",
        "version": "1.0.0",
    }


@app.post("/api/threads", response_model=ThreadResponse)
async def create_thread():
    """Create a new conversation thread"""
    try:
        thread_id = await openai_client.create_thread()
        return ThreadResponse(thread_id=thread_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create thread: {str(e)}")


@app.get("/api/threads/{thread_id}/messages", response_model=List[MessageResponse])
async def get_thread_messages(thread_id: str, limit: int = 50):
    """Get all messages from a thread"""
    try:
        messages = await openai_client.get_thread_messages(thread_id, limit)
        return [MessageResponse(**msg) for msg in messages]
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get messages: {str(e)}"
        )


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message to the assistant and get a response
    Creates a new thread if thread_id is not provided
    """
    try:
        # Create thread if not provided
        thread_id = request.thread_id
        if not thread_id:
            thread_id = await openai_client.create_thread()

        # Add user message to thread
        await openai_client.add_message(thread_id, request.message)

        # Run assistant and get response
        response = await openai_client.run_assistant(thread_id, request.ricef_type)

        return ChatResponse(
            thread_id=thread_id,
            message_id=response["message_id"],
            content=response["content"],
            role=response["role"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")


@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    thread_id: Optional[str] = Form(None),
    message: Optional[str] = Form("I've uploaded a file for processing."),
    ricef_type: Optional[str] = Form(None),
):
    """
    Upload a file, extract its content, and send to assistant as text.
    No file attachments - just parsed content in the message.
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

        # Extract text from file
        parsed_content = get_file_content_as_text(file_content, file.filename)
        
        # Build message with file content
        enhanced_message = f"{message}\n\nFile: {file.filename}\n\n{parsed_content}"

        # Create thread if needed
        if not thread_id:
            thread_id = await openai_client.create_thread()

        # Send message (no file attachment)
        await openai_client.add_message(thread_id, enhanced_message)

        # Get response
        response = await openai_client.run_assistant(thread_id, ricef_type)

        return {
            "thread_id": thread_id,
            "filename": file.filename,
            "message_id": response["message_id"],
            "content": response["content"],
            "role": response["role"],
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.delete("/api/threads/{thread_id}")
async def delete_thread(thread_id: str):
    """Delete a conversation thread (cleanup)"""
    # Note: OpenAI doesn't provide thread deletion yet
    # This endpoint is a placeholder for future implementation
    return {"message": "Thread deletion not supported by OpenAI API yet"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=settings.api_host, port=settings.api_port)
