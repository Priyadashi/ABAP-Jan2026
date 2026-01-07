"""
Test script for n8n webhook integration
"""
import asyncio
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from n8n_client import N8nWorkflowClient


async def test_health_check():
    """Test webhook connectivity"""
    print("Testing n8n webhook connectivity...")
    client = N8nWorkflowClient()
    
    # Health check
    is_healthy = await client.health_check()
    print(f"Webhook reachable: {is_healthy}")
    return is_healthy


async def test_file_upload():
    """Test file upload to webhook"""
    print("\nTesting file upload to n8n workflow...")
    client = N8nWorkflowClient()
    
    # Create a simple test xlsx-like content (just for connectivity test)
    # In reality, use a real xlsx file
    test_file_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "sample_report_spec.xlsx"
    )
    
    if os.path.exists(test_file_path):
        print(f"Using test file: {test_file_path}")
        with open(test_file_path, "rb") as f:
            file_content = f.read()
        filename = "sample_report_spec.xlsx"
    else:
        print("Sample xlsx not found, using dummy content")
        file_content = b"test content"
        filename = "test.txt"
    
    result = await client.send_file_to_workflow(
        file_content=file_content,
        filename=filename
    )
    
    print(f"Success: {result.get('success')}")
    if result.get('error'):
        print(f"Error: {result.get('error')}")
    print(f"Response content preview: {str(result.get('content', ''))[:200]}...")
    
    return result.get('success', False)


async def main():
    print("=" * 50)
    print("n8n Webhook Integration Test")
    print("=" * 50)
    
    # Run tests
    health_ok = await test_health_check()
    
    if health_ok:
        upload_ok = await test_file_upload()
        print("\n" + "=" * 50)
        print(f"Health Check: {'PASS' if health_ok else 'FAIL'}")
        print(f"File Upload: {'PASS' if upload_ok else 'FAIL'}")
    else:
        print("\nSkipping upload test - webhook not reachable")
        print("Make sure the n8n workflow is active and the webhook URL is correct")


if __name__ == "__main__":
    asyncio.run(main())
