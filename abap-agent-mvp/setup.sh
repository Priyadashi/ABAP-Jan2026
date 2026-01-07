#!/bin/bash

# 🚀 ABAP Agent MVP - Quick Setup Script
# This script automates the initial setup for non-programmers

set -e  # Exit on any error

echo "======================================="
echo "🚀 ABAP Agent MVP - Quick Setup"
echo "======================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the abap-agent-mvp directory"
    exit 1
fi

# Step 1: Backend setup
echo "📦 Step 1/4: Setting up backend..."
echo ""

cd api

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cp .env.example .env
    echo "✅ Backend .env file created"
    echo ""
    echo "⚠️  IMPORTANT: You need to add your OpenAI API key!"
    echo "   Open api/.env and replace 'sk-proj-your-api-key-here' with your actual key"
    echo ""
    read -p "Press Enter when you've added your API key to api/.env..."
else
    echo "✅ Backend .env file already exists"
fi

echo ""
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo ""
echo "✅ Backend setup complete!"
echo ""

cd ..

# Step 2: Frontend setup
echo "📦 Step 2/4: Setting up frontend..."
echo ""

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating frontend .env file..."
    cp .env.example .env
    echo "✅ Frontend .env file created (using defaults)"
else
    echo "✅ Frontend .env file already exists"
fi

echo ""
echo "Installing Node.js dependencies..."
npm install

echo ""
echo "✅ Frontend setup complete!"
echo ""

# Step 3: Summary
echo "======================================="
echo "✅ Setup Complete!"
echo "======================================="
echo ""
echo "Next steps:"
echo ""
echo "=== OpenAI Version (Default) ==="
echo "1. Start the backend server:"
echo "   cd api"
echo "   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "2. In a NEW terminal, start the frontend:"
echo "   npm run dev"
echo ""
echo "=== n8n Workflow Version (Alternative) ==="
echo "1. Start the n8n backend server:"
echo "   cd api"
echo "   python -m uvicorn main_n8n:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "2. In a NEW terminal, start the n8n frontend:"
echo "   npm run dev:n8n"
echo ""
echo "3. Open your browser to the URL shown by the frontend"
echo "   (usually http://localhost:5173)"
echo ""
echo "📘 For detailed instructions, see CODESPACES.md"
echo ""
echo "======================================="

