import React, { useState, useRef } from 'react';
import { Lightbulb, Copy, Download, RefreshCw, Upload, Send, FileJson, X, MessageSquare } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { useToast } from './Toast';

const ChatSection = () => {
  const { addToast } = useToast();
  const [lastCodeBlock, setLastCodeBlock] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/json') {
      setUploadedFile(file);
      addToast({
        message: `${file.name} uploaded successfully!`,
        type: 'success',
      });

      // Add a message showing the file was uploaded
      setMessages(prev => [...prev, {
        type: 'user',
        content: `📎 Uploaded: ${file.name}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } else {
      addToast({
        message: 'Please upload a valid JSON file',
        type: 'error',
      });
    }
  };

  const handleSendMessage = () => {
    if (!input.trim() && !uploadedFile) return;

    const userMessage = {
      type: 'user',
      content: input || 'Processing uploaded template...',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        type: 'assistant',
        content: '🤖 **AI ABAP Assistant**\n\nI\'m ready to help generate production-ready ABAP code! However, the ChatKit integration is currently being configured.\n\n**To proceed:**\n1. Your template has been received\n2. Please configure the OpenAI ChatKit component to enable AI code generation\n3. Once connected, I\'ll generate complete ABAP code following SAP best practices\n\n**What I can help with:**\n- Reports with ALV grids\n- Interface programs (IDoc, RFC, API)\n- Data conversion programs\n- Enhancement implementations\n- Smartforms and Adobe Forms',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInput('');
    setUploadedFile(null);
  };

  const handleCopyCode = () => {
    if (lastCodeBlock) {
      navigator.clipboard.writeText(lastCodeBlock);
      addToast({
        message: 'Code copied to clipboard!',
        type: 'success',
      });
    } else {
      addToast({
        message: 'No code to copy yet. Generate code first.',
        type: 'info',
      });
    }
  };

  const handleDownloadCode = () => {
    if (lastCodeBlock) {
      const blob = new Blob([lastCodeBlock], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'generated_code.abap';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast({
        message: 'Code downloaded as .abap file!',
        type: 'success',
      });
    } else {
      addToast({
        message: 'No code to download yet. Generate code first.',
        type: 'info',
      });
    }
  };

  const handleNewGeneration = () => {
    setMessages([]);
    setLastCodeBlock('');
    setInput('');
    setUploadedFile(null);
    addToast({
      message: 'Chat cleared. Ready for new generation!',
      type: 'success',
    });
  };

  return (
    <section id="chat-section" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            AI ABAP Assistant
          </h2>
          <p className="text-lg text-gray-600">
            Upload your filled template and start generating code
          </p>
        </div>

        {/* Instructions card */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  💡 Quick Start Guide
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  Upload your completed JSON template and describe any additional requirements.
                  The AI will generate production-ready ABAP code following SAP best practices,
                  including error handling, authorization checks, and comprehensive documentation.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Chat interface and action buttons */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Interface - Main chat area */}
            <div className="lg:col-span-3">
              <Card padding="none" className="overflow-hidden">
                {/* Chat Messages Area */}
                <div className="h-[450px] overflow-y-auto p-6 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                        <MessageSquare className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Welcome to ABAP AI Assistant
                      </h3>
                      <p className="text-gray-600 max-w-md">
                        Upload a JSON template below or type your requirements to get started
                        with AI-powered ABAP code generation.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-4 ${
                              msg.type === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-900'
                            }`}
                          >
                            <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                            <div
                              className={`text-xs mt-2 ${
                                msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {msg.timestamp}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 p-4 bg-white">
                  {uploadedFile && (
                    <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <FileJson className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-900 flex-1">{uploadedFile.name}</span>
                      <button
                        onClick={() => setUploadedFile(null)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".json"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-shrink-0 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      title="Upload JSON template"
                    >
                      <Upload className="w-5 h-5 text-gray-600" />
                    </button>

                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Describe your ABAP requirements or upload a template..."
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />

                    <Button
                      onClick={handleSendMessage}
                      variant="primary"
                      icon={Send}
                      disabled={!input.trim() && !uploadedFile}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </Card>

              {/* ChatKit Integration Notice */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Note:</strong> This is a temporary interface. Configure OpenAI ChatKit
                  (agent ID: wf_695b682cc6508190b4efd42040b8ee870d512e00ff2aae30) for full AI functionality.
                </p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="lg:col-span-1">
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleCopyCode}
                    variant="outline"
                    size="sm"
                    icon={Copy}
                    className="w-full justify-start"
                  >
                    Copy Code
                  </Button>
                  <Button
                    onClick={handleDownloadCode}
                    variant="outline"
                    size="sm"
                    icon={Download}
                    className="w-full justify-start"
                  >
                    Download .abap
                  </Button>
                  <Button
                    onClick={handleNewGeneration}
                    variant="outline"
                    size="sm"
                    icon={RefreshCw}
                    className="w-full justify-start"
                  >
                    New Generation
                  </Button>
                </div>

                {/* Tips section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">
                    Pro Tips
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Upload JSON templates for better results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Provide specific field names and table references</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Ask for refinements or modifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Request additional documentation or comments</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;
