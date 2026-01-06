import requests
import json
import sys

try:
    response = requests.post(
        "http://localhost:8000/api/chat",
        json={"message": "Please generate a simple ABAP report."}
    )
    response.raise_for_status()
    print("Success!")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
    if hasattr(e, 'response') and e.response is not None:
        print(f"Response text: {e.response.text}")
    sys.exit(1)
