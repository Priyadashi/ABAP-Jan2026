# 🚀 ABAP Agent MVP - Deployment Guide

Complete guide for deploying the ABAP Agent MVP with FastAPI backend and React frontend.

## 📋 Architecture Overview

```
┌─────────────────┐      HTTP/REST      ┌──────────────────┐      OpenAI API     ┌─────────────┐
│  React Frontend │ ◄───────────────────► │ FastAPI Backend  │ ◄──────────────────► │   OpenAI    │
│   (Vite + React)│                      │  (Python 3.11)   │                     │ Assistants  │
└─────────────────┘                      └──────────────────┘                     └─────────────┘
```

## 🔧 Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- OpenAI API key
- OpenAI Assistant ID

### 1. Backend Setup

```bash
# Navigate to API directory
cd api

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
cp .env.example .env

# Edit .env and add your OpenAI API key
nano .env  # or use any text editor
```

**Required in `.env`:**
```
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
OPENAI_ASSISTANT_ID=asst_A68xa1Vrevyh1Wm3CP81jCVx
```

**Start the backend:**
```bash
# From the api/ directory
python -m uvicorn main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

### 2. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env if needed (default values should work)
# VITE_API_URL=http://localhost:8000

# Start the frontend
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### 3. Verify Setup

1. Open browser to `http://localhost:5173`
2. You should see the ABAP Agent MVP interface
3. Try sending a message or uploading a template
4. Check browser console and backend terminal for any errors

## 🐳 Docker Deployment

### Build Backend Docker Image

```bash
cd api
docker build -t abap-agent-api .
```

### Run with Docker

```bash
# Run backend
docker run -p 8000:8080 \
  -e OPENAI_API_KEY=your-key-here \
  -e OPENAI_ASSISTANT_ID=asst_A68xa1Vrevyh1Wm3CP81jCVx \
  -e PORT=8080 \
  abap-agent-api

# Build and run frontend
cd ..
npm run build
npx serve dist -p 5173
```

## ☁️ Google Cloud Run Deployment

### Deploy Backend to Cloud Run

```bash
# Set your project ID
export PROJECT_ID=your-gcp-project-id
export REGION=us-central1

# Build and deploy
gcloud builds submit --tag gcr.io/$PROJECT_ID/abap-agent-api ./api

gcloud run deploy abap-agent-api \
  --image gcr.io/$PROJECT_ID/abap-agent-api \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars OPENAI_API_KEY=your-key-here,OPENAI_ASSISTANT_ID=asst_A68xa1Vrevyh1Wm3CP81jCVx
```

**⚠️ Security Note:** For production, use Secret Manager instead of env vars:

```bash
# Create secret
echo -n "your-openai-key" | gcloud secrets create openai-api-key --data-file=-

# Deploy with secret
gcloud run deploy abap-agent-api \
  --image gcr.io/$PROJECT_ID/abap-agent-api \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-secrets OPENAI_API_KEY=openai-api-key:latest \
  --set-env-vars OPENAI_ASSISTANT_ID=asst_A68xa1Vrevyh1Wm3CP81jCVx
```

### Deploy Frontend to Vercel/Netlify

**Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variable in Vercel dashboard:
# VITE_API_URL=https://your-backend-url.run.app
```

**Netlify:**
```bash
# Build
npm run build

# Deploy dist/ folder via Netlify CLI or dashboard
```

## 🔐 Environment Variables Reference

### Frontend (`.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |
| `VITE_ASSISTANT_ID` | Display assistant ID (optional) | `asst_A68xa1Vrevyh1Wm3CP81jCVx` |

### Backend (`api/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | ✅ Yes |
| `OPENAI_ASSISTANT_ID` | Default assistant ID | ✅ Yes |
| `API_HOST` | Host to bind to | No (default: 0.0.0.0) |
| `API_PORT` | Port to listen on | No (default: 8000) |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | No (default: localhost) |
| `MAX_FILE_SIZE` | Max upload size in bytes | No (default: 10MB) |

## 🧪 Testing the Integration

### Test Backend Health

```bash
curl http://localhost:8000/
# Expected: {"status":"healthy","service":"ABAP Agent API","version":"1.0.0"}
```

### Test Chat Endpoint

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, can you help me create an ABAP report?"}'
```

### Test File Upload

```bash
curl -X POST http://localhost:8000/api/upload \
  -F "file=@path/to/template.json" \
  -F "message=Please process this template"
```

## 📊 Monitoring

### Cloud Run Monitoring

- View logs: `gcloud run logs tail abap-agent-api`
- View metrics in GCP Console > Cloud Run > abap-agent-api
- Set up alerts for errors, latency, etc.

### Local Debugging

Backend logs are printed to console when running with `--reload`.

Enable verbose logging:
```python
# In api/main.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 🔄 CI/CD Setup

### GitHub Actions (Example)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v0
        with:
          project_id: ${{ secrets.GCP_PROJECT_ID }}
          service_account_key: ${{ secrets.GCP_SA_KEY }}

      - name: Build and Deploy
        run: |
          gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/abap-agent-api ./api
          gcloud run deploy abap-agent-api \\
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/abap-agent-api \\
            --platform managed \\
            --region us-central1 \\
            --set-secrets OPENAI_API_KEY=openai-api-key:latest
```

## 🛠️ Troubleshooting

### Backend Won't Start

1. Check Python version: `python3 --version` (need 3.11+)
2. Verify API key is set: `echo $OPENAI_API_KEY`
3. Check dependencies: `pip list | grep openai`

### Frontend Can't Connect to Backend

1. Verify backend is running: `curl http://localhost:8000/`
2. Check CORS settings in `api/config.py`
3. Verify `VITE_API_URL` in frontend `.env`

### OpenAI API Errors

1. Verify API key is valid
2. Check assistant exists: Use OpenAI Playground
3. Review OpenAI API usage limits

### File Upload Issues

1. Check file size < 10MB
2. Verify file type is `.json` or `.txt`
3. Check backend logs for detailed error

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangible.com/)
- [OpenAI Assistants API](https://platform.openai.com/docs/assistants)
- [Vite Documentation](https://vitejs.dev/)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)

---

**Need help?** Check the main [README.md](./README.md) or open an issue on GitHub.
