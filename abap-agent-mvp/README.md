# 🚀 ABAP AI Assistant - MVP

A professional full-stack web application that helps SAP developers generate production-ready ABAP code using OpenAI's Assistants API. Features a React frontend with Vite and a FastAPI backend for secure AI interactions.

![ABAP AI Assistant](https://img.shields.io/badge/ABAP-AI%20Powered-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python)
![OpenAI](https://img.shields.io/badge/OpenAI-Assistants%20API-412991?logo=openai)

## ✨ What's New - OpenAI Assistants API Integration

**🎉 Major Update:** Complete rewrite using OpenAI Assistants API with FastAPI backend!

- ✅ **Production-Ready Backend**: FastAPI server with OpenAI Assistants API integration
- ✅ **Secure Architecture**: API key never exposed to frontend
- ✅ **File Upload Support**: Upload JSON/TXT templates directly to AI
- ✅ **Conversation Threading**: Maintains context across multiple messages
- ✅ **ABAP Code Highlighting**: Syntax-highlighted code blocks
- ✅ **Real-time Streaming**: Live responses from AI assistant
- ✅ **Docker Ready**: Containerized backend for easy deployment
- ✅ **Cloud Run Compatible**: Deploy to Google Cloud with one command

## 🏗️ Architecture

```
┌─────────────────┐      REST API       ┌──────────────────┐      OpenAI API     ┌─────────────┐
│  React Frontend │ ◄───────────────────► │ FastAPI Backend  │ ◄──────────────────► │   OpenAI    │
│   (Port 5173)   │    HTTP/JSON         │  (Port 8000)     │   Assistants API    │  Assistant  │
└─────────────────┘                      └──────────────────┘                     └─────────────┘
```

## 🚀 Quick Start

### 1. Backend Setup (Required)

```bash
# Navigate to API directory
cd api

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-proj-your-key-here
# OPENAI_ASSISTANT_ID=asst_A68xa1Vrevyh1Wm3CP81jCVx

# Start backend
python -m uvicorn main:app --reload
```

Backend will run at: `http://localhost:8000`

### 2. Frontend Setup

```bash
# Navigate back to project root
cd ..

# Install dependencies
npm install

# Create .env file (optional - has defaults)
cp .env.example .env

# Start frontend
npm run dev
```

Frontend will run at: `http://localhost:5173`

### 3. Open Browser

Navigate to `http://localhost:5173` and start generating ABAP code!

## 📋 Features

### Core Functionality
- ✨ **AI-Powered Code Generation**: OpenAI Assistants API integration
- 📁 **RICEF Template Library**: 5 pre-structured JSON templates
- 📤 **File Upload**: Drag & drop JSON/TXT files
- 💬 **Interactive Chat**: Real-time conversation with AI
- 📋 **Code Management**: Copy to clipboard or download as .abap files
- 🎨 **ABAP Syntax Highlighting**: Color-coded code blocks
- 🔄 **Conversation Threading**: Maintains context across messages
- 📱 **Responsive Design**: Works on all devices

### RICEF Types Supported
1. **Reports** - ALV reports, list outputs, and custom data extracts
2. **Interfaces** - IDoc, RFC, API, and file-based integrations
3. **Conversions** - LSMW, BDC, and direct input programs
4. **Enhancements** - User Exits, BADIs, and Enhancement Spots
5. **Forms** - Smartforms and Adobe Forms with print programs

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite 5+
- **Styling**: Tailwind CSS 3+
- **Icons**: Lucide React
- **State**: React Hooks

### Backend
- **Framework**: FastAPI 0.115+
- **Language**: Python 3.11+
- **AI Integration**: OpenAI Assistants API
- **CORS**: Configured for local + production
- **Validation**: Pydantic models

## 📁 Project Structure

```
abap-agent-mvp/
├── api/                        # FastAPI Backend
│   ├── main.py                 # Main FastAPI application
│   ├── openai_client.py        # OpenAI Assistants API client
│   ├── config.py               # Environment configuration
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile              # Backend containerization
│   └── .env.example            # Environment variables template
├── public/
│   └── templates/              # RICEF JSON template files
│       ├── report_template.json
│       ├── interface_template.json
│       ├── conversion_template.json
│       ├── enhancement_template.json
│       └── form_template.json
├── src/
│   ├── components/
│   │   ├── ChatSection.jsx     # AI chat interface (API-integrated)
│   │   ├── TemplateLibrary.jsx # Template downloads
│   │   ├── Hero.jsx            # Landing section
│   │   ├── HowItWorks.jsx      # 4-step guide
│   │   ├── FeatureCards.jsx    # Benefits showcase
│   │   └── ...                 # Other UI components
│   ├── App.jsx                 # Main React app
│   └── index.css               # Tailwind styles
├── DEPLOYMENT.md               # Detailed deployment guide
├── README.md                   # This file
└── package.json                # Frontend dependencies
```

## 🔧 Configuration

### Backend Environment Variables

Create `api/.env`:

```bash
# Required
OPENAI_API_KEY=sk-proj-your-api-key-here
OPENAI_ASSISTANT_ID=asst_A68xa1Vrevyh1Wm3CP81jCVx

# Optional
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
MAX_FILE_SIZE=10485760  # 10MB
```

### Frontend Environment Variables

Create `.env` (optional - has defaults):

```bash
VITE_API_URL=http://localhost:8000
VITE_ASSISTANT_ID=asst_A68xa1Vrevyh1Wm3CP81jCVx
```

## 📖 API Endpoints

### Backend API

- `GET /` - Health check
- `POST /api/threads` - Create new conversation thread
- `GET /api/threads/{thread_id}/messages` - Get conversation history
- `POST /api/chat` - Send message to AI assistant
- `POST /api/upload` - Upload file and get AI response

### Example Usage

```bash
# Send a chat message
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Create an ABAP ALV report for sales data"}'

# Upload a template
curl -X POST http://localhost:8000/api/upload \
  -F "file=@report_template.json" \
  -F "message=Generate code from this template"
```

## 🐳 Docker Deployment

### Build and Run Backend

```bash
cd api
docker build -t abap-agent-api .

docker run -p 8000:8080 \
  -e OPENAI_API_KEY=your-key \
  -e OPENAI_ASSISTANT_ID=asst_A68xa1Vrevyh1Wm3CP81jCVx \
  -e PORT=8080 \
  abap-agent-api
```

### Build Frontend

```bash
npm run build
npx serve dist
```

## ☁️ Cloud Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to:
- Google Cloud Run
- Vercel/Netlify (Frontend)
- AWS/Azure (Backend)

## 🧪 Testing

### Test Backend

```bash
# Health check
curl http://localhost:8000/

# Test chat
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

### Test Frontend

1. Open `http://localhost:5173`
2. Upload a JSON template
3. Send a message
4. Verify code generation works

## 🔒 Security

- ✅ API key stored securely on backend only
- ✅ CORS configured for allowed origins
- ✅ File upload validation (type, size)
- ✅ Input sanitization
- ✅ Environment-based configuration

**⚠️ Important:** Never commit `.env` files or expose API keys!

## 📚 Usage Guide

1. **Download a Template**: Choose from 5 RICEF types
2. **Fill the Template**: Add your specifications
3. **Upload or Chat**: Upload JSON or describe requirements
4. **Get ABAP Code**: Receive production-ready code
5. **Copy/Download**: Use quick actions to save code

## 🤝 Contributing

Future enhancements:
- Multiple RICEF-specific assistants
- Code history and versioning
- User authentication
- Advanced syntax highlighting
- Unit test generation
- Transport request integration

## 📄 License

This project is provided as-is for demonstration purposes.

## 🆘 Support

For setup issues:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Verify environment variables
3. Check backend logs
4. Review browser console

---

**Built with ❤️ for SAP Developers** | Powered by OpenAI Assistants API
