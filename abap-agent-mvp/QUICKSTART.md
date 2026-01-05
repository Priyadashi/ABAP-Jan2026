# 🚀 Quick Start Guide

Get the ABAP AI Assistant running in 3 simple steps!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Step 3: Integrate ChatKit (Optional)

To enable AI code generation:

1. Install ChatKit:
   ```bash
   npm install @openai/chatkit
   ```

2. Open `src/components/ChatSection.jsx` and replace the placeholder with:
   ```jsx
   import { ChatKit } from '@openai/chatkit';

   <ChatKit
     agentId="YOUR_AGENT_ID"
     enableFileUpload={true}
     acceptedFileTypes={['.json']}
     placeholder="Upload your filled template..."
     theme="light"
     height="600px"
   />
   ```

3. Add your OpenAI agent ID

## 🎯 Try It Out

1. **Download a template** from the Template Library section
2. **Fill it out** with your ABAP specifications
3. **Upload it** to the AI assistant
4. **Get production-ready ABAP code**!

## 📦 Build for Production

```bash
npm run build
```

Files will be in the `dist/` folder, ready to deploy!

## 🆘 Need Help?

Check the full [README.md](./README.md) for detailed documentation.

---

**Happy coding! 🎉**
