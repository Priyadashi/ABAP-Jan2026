"""
n8n Workflow Client
Handles communication with n8n webhooks for ABAP code generation
"""
import httpx
from typing import Dict, Any, Optional
from config import settings


class N8nWorkflowClient:
    """Client for interacting with n8n workflow webhooks"""

    def __init__(self):
        self.webhook_url = settings.n8n_webhook_url
        self.timeout = settings.n8n_timeout

    async def send_file_to_workflow(
        self, 
        file_content: bytes, 
        filename: str,
        additional_data: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Send a file to the n8n workflow webhook.
        
        Args:
            file_content: Raw bytes of the file
            filename: Original filename (for content-type detection)
            additional_data: Optional additional form fields
            
        Returns:
            Dict containing the workflow response
        """
        # Prepare multipart form data
        files = {
            "file": (filename, file_content, self._get_content_type(filename))
        }
        
        # Add any additional form data
        data = additional_data or {}

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(
                    self.webhook_url,
                    files=files,
                    data=data
                )
                response.raise_for_status()
                
                # Try to parse as JSON, fallback to text
                try:
                    result = response.json()
                    print(f"[DEBUG] n8n raw response type: {type(result)}")
                    print(f"[DEBUG] n8n raw response: {str(result)[:500]}")
                    
                    # Extract content from various possible response formats
                    content = self._extract_content(result)
                    print(f"[DEBUG] Extracted content: {str(content)[:200]}")
                    
                    return {
                        "success": True,
                        "content": content,
                        "raw_response": result
                    }
                except Exception as e:
                    print(f"[DEBUG] JSON parse failed: {e}, using text")
                    # Return as plain text if not JSON
                    return {
                        "success": True,
                        "content": response.text,
                        "raw_response": response.text
                    }
                    
            except httpx.HTTPStatusError as e:
                return {
                    "success": False,
                    "error": f"HTTP {e.response.status_code}: {e.response.text}",
                    "content": f"Workflow returned error: {e.response.status_code}"
                }
            except httpx.TimeoutException:
                return {
                    "success": False,
                    "error": "Workflow timed out",
                    "content": f"The n8n workflow did not respond within {self.timeout} seconds"
                }
            except Exception as e:
                return {
                    "success": False,
                    "error": str(e),
                    "content": f"Failed to connect to workflow: {str(e)}"
                }

    def _extract_content(self, result: Any) -> str:
        """
        Recursively extract content from n8n response.
        Handles various formats: dict, list, nested structures.
        """
        # Common keys where n8n might put the content - prioritize abap_code
        content_keys = ['abap_code', 'code', 'output', 'response', 'content', 'text', 'message', 'result', 'data']
        
        if isinstance(result, str):
            return result
        
        if isinstance(result, list):
            if not result:
                return ""
            # Process first item in list
            return self._extract_content(result[0])
        
        if isinstance(result, dict):
            # Try to find content in common keys
            for key in content_keys:
                if key in result:
                    value = result[key]
                    if isinstance(value, str) and value.strip():
                        return value
                    elif isinstance(value, (dict, list)):
                        extracted = self._extract_content(value)
                        if extracted:
                            return extracted
            
            # If no common key found, try all string values
            for key, value in result.items():
                if isinstance(value, str) and len(value) > 50:  # Likely content
                    return value
            
            # Last resort: stringify the dict
            return str(result)
        
        return str(result)

    def _get_content_type(self, filename: str) -> str:
        """Get content type based on file extension"""
        ext = filename.lower().split('.')[-1] if '.' in filename else ''
        content_types = {
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'xls': 'application/vnd.ms-excel',
            'json': 'application/json',
            'txt': 'text/plain',
        }
        return content_types.get(ext, 'application/octet-stream')

    async def health_check(self) -> bool:
        """Check if the webhook endpoint is reachable"""
        async with httpx.AsyncClient(timeout=10) as client:
            try:
                # Simple HEAD request to check connectivity
                response = await client.head(self.webhook_url)
                return response.status_code < 500
            except Exception:
                return False
