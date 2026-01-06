"""
Configuration for ABAP Agent API
Handles environment variables and settings
"""
import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings from environment variables"""

    # OpenAI Configuration
    openai_api_key: str
    openai_assistant_id: str = "asst_A68xa1Vrevyh1Wm3CP81jCVx"

    # RICEF-specific assistants (for future expansion)
    assistant_report: Optional[str] = None
    assistant_interface: Optional[str] = None
    assistant_conversion: Optional[str] = None
    assistant_enhancement: Optional[str] = None
    assistant_form: Optional[str] = None

    # API Configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    # Application Settings
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_file_types: list = [".json", ".txt"]

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "allow"


# Global settings instance
settings = Settings()


def get_assistant_id(ricef_type: Optional[str] = None) -> str:
    """
    Get the appropriate assistant ID based on RICEF type
    Falls back to default assistant if specific one not configured
    """
    if not ricef_type:
        return settings.openai_assistant_id

    assistant_map = {
        "report": settings.assistant_report,
        "interface": settings.assistant_interface,
        "conversion": settings.assistant_conversion,
        "enhancement": settings.assistant_enhancement,
        "form": settings.assistant_form,
    }

    # Return specific assistant or fall back to default
    return assistant_map.get(ricef_type.lower()) or settings.openai_assistant_id
