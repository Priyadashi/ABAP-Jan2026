"""
OpenAI Assistants API Client
Handles all interactions with OpenAI's Assistants API
"""
import asyncio
import time
from typing import Optional, List, Dict, Any
from openai import AsyncOpenAI
from .config import settings, get_assistant_id


class OpenAIAssistantClient:
    """Client for interacting with OpenAI Assistants API"""

    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.default_assistant_id = settings.openai_assistant_id

    async def create_thread(self) -> str:
        """Create a new conversation thread"""
        thread = await self.client.beta.threads.create()
        return thread.id

    async def add_message(
        self, thread_id: str, content: str, file_ids: Optional[List[str]] = None
    ) -> str:
        """Add a message to a thread"""
        message_params = {
            "thread_id": thread_id,
            "role": "user",
            "content": content,
        }

        if file_ids:
            message_params["attachments"] = [
                {"file_id": file_id, "tools": [{"type": "file_search"}]}
                for file_id in file_ids
            ]

        message = await self.client.beta.threads.messages.create(**message_params)
        return message.id

    async def upload_file(self, file_content: bytes, filename: str) -> str:
        """Upload a file to OpenAI and return file ID"""
        file_response = await self.client.files.create(
            file=(filename, file_content), purpose="assistants"
        )
        return file_response.id

    async def run_assistant(
        self, thread_id: str, ricef_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Run the assistant on a thread and wait for completion
        Returns the assistant's response
        """
        assistant_id = get_assistant_id(ricef_type)

        # Create a run
        run = await self.client.beta.threads.runs.create(
            thread_id=thread_id, assistant_id=assistant_id
        )

        # Poll for completion
        max_attempts = 60  # 60 seconds timeout
        attempt = 0

        while attempt < max_attempts:
            run_status = await self.client.beta.threads.runs.retrieve(
                thread_id=thread_id, run_id=run.id
            )

            if run_status.status == "completed":
                break
            elif run_status.status in ["failed", "cancelled", "expired"]:
                raise Exception(f"Run {run_status.status}: {run_status.last_error}")

            await asyncio.sleep(1)
            attempt += 1

        if attempt >= max_attempts:
            raise Exception("Assistant response timeout")

        # Get the assistant's messages
        messages = await self.client.beta.threads.messages.list(
            thread_id=thread_id, order="desc", limit=1
        )

        if not messages.data:
            raise Exception("No response from assistant")

        # Extract text content from the message
        message = messages.data[0]
        response_text = ""

        for content_block in message.content:
            if hasattr(content_block, "text"):
                response_text += content_block.text.value

        return {
            "message_id": message.id,
            "content": response_text,
            "role": message.role,
            "created_at": message.created_at,
        }

    async def get_thread_messages(
        self, thread_id: str, limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Get all messages from a thread"""
        messages = await self.client.beta.threads.messages.list(
            thread_id=thread_id, order="asc", limit=limit
        )

        formatted_messages = []
        for message in messages.data:
            content = ""
            for content_block in message.content:
                if hasattr(content_block, "text"):
                    content += content_block.text.value

            formatted_messages.append(
                {
                    "id": message.id,
                    "role": message.role,
                    "content": content,
                    "created_at": message.created_at,
                }
            )

        return formatted_messages

    async def delete_file(self, file_id: str) -> bool:
        """Delete a file from OpenAI"""
        try:
            await self.client.files.delete(file_id)
            return True
        except Exception as e:
            print(f"Error deleting file {file_id}: {e}")
            return False
