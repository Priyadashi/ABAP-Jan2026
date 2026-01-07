import requests
import os
import sys

# Create a dummy test file
test_file_path = "test_upload_file.json"
with open(test_file_path, "w") as f:
    f.write('{"test": "data"}')

try:
    print(f"Testing upload with file: {test_file_path}")
    with open(test_file_path, "rb") as f:
        files = {"file": (test_file_path, f, "application/json")}
        data = {"message": "Please process this test file."}
        
        response = requests.post(
            "http://localhost:8000/api/upload",
            files=files,
            data=data
        )
    
    response.raise_for_status()
    print("Upload Success!")
    print(response.json())
except Exception as e:
    print(f"Upload Error: {e}")
    if hasattr(e, 'response') and e.response is not None:
        print(f"Response status: {e.response.status_code}")
        print(f"Response text: {e.response.text}")
finally:
    if os.path.exists(test_file_path):
        os.remove(test_file_path)
