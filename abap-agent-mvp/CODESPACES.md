# 🚀 GitHub Codespaces Setup Guide (For Non-Programmers)

Welcome! This guide will help you run the ABAP Agent MVP in GitHub Codespaces with simple copy-paste commands.

## 📌 What You'll Do

1. Open the terminal in Codespaces
2. Set up your OpenAI API key
3. Start the backend server (Python)
4. Start the frontend app (React)
5. Use the application in your browser

## ⏱️ Total Time: About 5 minutes

---

## Step 1: Open the Terminal

When your Codespace loads, you'll see the code editor. At the bottom, there's a **Terminal** panel (it looks like a command prompt or black window).

If you don't see it:
- Click on the menu: **Terminal** → **New Terminal**

✅ You should now see a terminal with a blinking cursor.

---

## Step 2: Set Up Your OpenAI API Key

You need to tell the application your OpenAI API key so it can generate ABAP code.

### Copy and paste these commands one by one:

**Command 1: Go to the API folder**
```bash
cd api
```
*This navigates to the backend folder*

**Command 2: Create the configuration file**
```bash
cp .env.example .env
```
*This creates a new file called `.env` where we'll store your API key*

**Command 3: Open the file to edit**
```bash
nano .env
```
*This opens a simple text editor*

### Now you'll see a file with this content:
```
OPENAI_API_KEY=sk-proj-your-api-key-here
OPENAI_ASSISTANT_ID=asst_A68xa1Vrevyh1Wm3CP81jCVx
```

### 📝 Edit the file:

1. Use arrow keys to move the cursor to the line with `OPENAI_API_KEY`
2. Delete the text `sk-proj-your-api-key-here`
3. Type or paste your actual OpenAI API key (it starts with `sk-proj-` or `sk-`)
4. The assistant ID is already correct - don't change it

### 💾 Save and exit:

1. Press `Ctrl + X` (hold Control and press X)
2. Press `Y` (to confirm save)
3. Press `Enter` (to confirm filename)

✅ Your API key is now saved!

---

## Step 3: Install Backend Dependencies

The backend needs some Python libraries to work.

**Command: Install Python packages**
```bash
pip install -r requirements.txt
```
*This installs all the Python libraries needed (takes about 30 seconds)*

Wait until you see messages finishing with "Successfully installed..." and the cursor returns.

---

## Step 4: Start the Backend Server

Now we'll start the Python server that talks to OpenAI.

**Command: Start the backend**
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*This starts the backend server on port 8000*

### ✅ Success looks like:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**🎉 Your backend is now running!**

⚠️ **IMPORTANT**: Keep this terminal running. Do NOT close it or press Ctrl+C.

---

## Step 5: Open a New Terminal

We need a second terminal for the frontend.

1. Click the **+** button in the terminal panel (top right of terminal)
2. Or use menu: **Terminal** → **New Terminal**

You now have two terminals:
- **Terminal 1**: Backend (shows "Uvicorn running...")
- **Terminal 2**: New terminal (ready for commands)

Make sure you're in Terminal 2 for the next steps.

---

## Step 6: Set Up Frontend Configuration

**Command 1: Go back to the main folder**
```bash
cd /workspaces/ABAP-Jan2026/abap-agent-mvp
```
*This goes to the project root folder*

**Command 2: Create frontend config file**
```bash
cp .env.example .env
```
*This creates the frontend configuration*

The default settings should work perfectly in Codespaces!

---

## Step 7: Install Frontend Dependencies

The frontend needs some JavaScript libraries.

**Command: Install Node packages**
```bash
npm install
```
*This installs React and all other frontend libraries (takes about 1-2 minutes)*

Wait until you see "added XXX packages" and the cursor returns.

---

## Step 8: Start the Frontend

**Command: Start the React app**
```bash
npm run dev
```
*This starts the frontend development server*

### ✅ Success looks like:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**🎉 Your frontend is now running!**

---

## Step 9: Open the Application

GitHub Codespaces will automatically detect that port 5173 is running.

### You should see a popup:
- "Your application running on port 5173 is available"
- Click **"Open in Browser"** or **"Open in Preview"**

If you don't see the popup:
1. Look at the bottom of the screen for **"PORTS"** tab
2. Click on it
3. Find port **5173**
4. Right-click it and select **"Open in Browser"**

### 🎊 You should now see the ABAP Agent MVP application!

---

## 🧪 Testing the Application

1. **Try the chat**: Scroll down to the chat section and type a message like:
   ```
   Can you help me create a simple ABAP report?
   ```

2. **Try uploading a template**:
   - Click "Download Templates" to get a template file
   - Upload it back to the chat
   - Ask the AI to process it

3. **View the code**: The AI will generate ABAP code in green terminal-style text blocks

4. **Copy code**: Click the "Copy Code" button to copy generated code

---

## 🛑 How to Stop Everything

When you're done:

1. Go to **Terminal 2** (frontend) and press `Ctrl + C`
2. Go to **Terminal 1** (backend) and press `Ctrl + C`

Both servers will stop.

---

## 🔧 Troubleshooting

### Problem: "pip: command not found"
**Solution**: Python might not be installed. In terminal, run:
```bash
sudo apt-get update && sudo apt-get install -y python3 python3-pip
```

### Problem: "npm: command not found"
**Solution**: Node.js might not be installed. In terminal, run:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Problem: Backend shows "OpenAI API error"
**Solution**: Check your API key:
1. Make sure you copied the entire key (no spaces)
2. Verify the key is valid in your OpenAI account
3. Check that your OpenAI account has credits

### Problem: Frontend can't connect to backend
**Solution**:
1. Check that Terminal 1 shows "Uvicorn running..."
2. Make sure you didn't close the backend terminal
3. Restart the backend (go to Terminal 1, Ctrl+C, then re-run the uvicorn command)

### Problem: Port 5173 or 8000 already in use
**Solution**:
```bash
# Kill processes on port 8000 (backend)
pkill -f uvicorn

# Kill processes on port 5173 (frontend)
pkill -f vite
```
Then restart the servers.

### Problem: "ModuleNotFoundError: No module named 'fastapi'"
**Solution**: The pip install didn't complete. Run it again:
```bash
cd /workspaces/ABAP-Jan2026/abap-agent-mvp/api
pip install -r requirements.txt
```

---

## 📋 Quick Reference: All Commands

**Backend Setup:**
```bash
cd api
cp .env.example .env
nano .env
# (add your API key, save with Ctrl+X, Y, Enter)
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend Setup (in new terminal):**
```bash
cd /workspaces/ABAP-Jan2026/abap-agent-mvp
cp .env.example .env
npm install
npm run dev
```

**Open application:**
- Click "Open in Browser" popup for port 5173
- Or use PORTS tab → Right-click 5173 → "Open in Browser"

---

## 💡 Tips

- **Keep both terminals running**: Don't close them while using the app
- **Codespaces auto-saves**: Your changes are automatically saved
- **Codespace times out**: If idle for 30 minutes, it stops. Just restart when you come back
- **View logs**: Watch Terminal 1 (backend) to see what's happening behind the scenes
- **Refresh browser**: If something looks wrong, refresh your browser (F5)

---

## 🎓 What Each Part Does

- **Backend (Terminal 1)**: Python server that talks to OpenAI's AI
- **Frontend (Terminal 2)**: React app that shows the website you interact with
- **API Key**: Your secret key that lets the app use OpenAI's AI services
- **Port 8000**: Where the backend server runs
- **Port 5173**: Where the frontend website runs

---

## 📞 Need Help?

If you're stuck:
1. Check the terminal for error messages (red text)
2. Copy the error and search for it
3. Make sure both servers are running (check both terminals)
4. Try refreshing your browser
5. Restart the Codespace if all else fails

---

**Ready to start? Go back to Step 1 and begin!** 🚀
