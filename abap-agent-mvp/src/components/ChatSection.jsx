import React, { useState, useRef, useEffect } from 'react';
import { Lightbulb, Copy, Download, RefreshCw, Upload, Send, FileJson, X, MessageSquare, Loader2 } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { useToast } from './Toast';

// Automatically detect API URL for GitHub Codespaces
const getApiUrl = () => {
  // Check if explicitly set in env
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Check if running in GitHub Codespaces
  const hostname = window.location.hostname;
  if (hostname.includes('github.dev')) {
    // Replace port 5173 with 8000 for backend
    return window.location.origin.replace('-5173', '-8000');
  }

  // Default to localhost
  return 'http://localhost:8000';
};

const API_URL = getApiUrl();

const ChatSection = () => {
  const { addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [threadId, setThreadId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCodeBlock, setLastCodeBlock] = useState('');
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const extractCodeBlocks = (content) => {
    const codeBlockRegex = /```(?:abap)?\n([\s\S]*?)```/g;
    const matches = [...content.matchAll(codeBlockRegex)];
    if (matches.length > 0) {
      setLastCodeBlock(matches[matches.length - 1][1].trim());
    }
  };

  const handleFileSelect = (file) => {
    if (file && (file.name.endsWith('.json') || file.name.endsWith('.txt') || file.name.endsWith('.xlsx'))) {
      setUploadedFile(file);
      addToast({ message: `${file.name} ready to upload`, type: 'success' });
    } else {
      addToast({ message: 'Please select a .json, .txt, or .xlsx file', type: 'error' });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !uploadedFile) return;

    const userMessage = {
      role: 'user',
      content: input || `Uploaded file: ${uploadedFile?.name}`,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let response;

      if (uploadedFile) {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('message', input || `Process this file: ${uploadedFile.name}`);
        if (threadId) formData.append('thread_id', threadId);

        response = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch(`${API_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ thread_id: threadId, message: input }),
        });
      }

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      if (!threadId) setThreadId(data.thread_id);
      extractCodeBlocks(data.content);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString(),
      }]);

      addToast({ message: 'Response received!', type: 'success' });
    } catch (error) {
      addToast({ message: `Error: ${error.message}`, type: 'error' });
      setMessages(prev => [...prev, {
        role: 'error',
        content: `⚠️ Connection error. Check backend is running.\n\nError: ${error.message}`,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    } finally {
      setIsLoading(false);
      setInput('');
      setUploadedFile(null);
    }
  };

  const renderMessageContent = (content) => {
    const parts = [];
    let lastIndex = 0;
    const codeBlockRegex = /```(?:abap)?\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<p key={`text-${lastIndex}`} className="whitespace-pre-wrap">{content.substring(lastIndex, match.index)}</p>);
      }
      parts.push(
        <div key={`code-${match.index}`} className="my-4">
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 text-xs text-gray-300 flex justify-between items-center">
              <span>ABAP</span>
              <button onClick={() => { navigator.clipboard.writeText(match[1].trim()); addToast({ message: 'Copied!', type: 'success' }); }} className="hover:text-white"><Copy className="w-3 h-3" /></button>
            </div>
            <pre className="p-4 overflow-x-auto"><code className="text-sm text-green-400 font-mono">{match[1].trim()}</code></pre>
          </div>
        </div>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(<p key={`text-${lastIndex}`} className="whitespace-pre-wrap">{content.substring(lastIndex)}</p>);
    }

    return parts.length > 0 ? parts : <p className="whitespace-pre-wrap">{content}</p>;
  };

  return (
    <section id="chat-section" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">AI ABAP Assistant</h2>
          <p className="text-lg text-gray-600">Upload your filled template and start generating code</p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-2">💡 Quick Start Guide</h4>
                <p className="text-gray-700 leading-relaxed">Upload your completed JSON template and describe any additional requirements. The AI will generate production-ready ABAP code following SAP best practices.</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card padding="none" className="overflow-hidden">
                <div className="h-[450px] overflow-y-auto p-6 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                        <MessageSquare className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to ABAP AI Assistant</h3>
                      <p className="text-gray-600 max-w-md mb-4">Upload a JSON template or type your requirements to get started</p>
                      <div className="text-sm text-gray-500">Assistant ID: asst_A68xa1Vrevyh1Wm3CP81jCVx</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] rounded-lg p-4 ${msg.role === 'user' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : msg.role === 'error' ? 'bg-red-50 border border-red-200 text-red-900' : 'bg-white border border-gray-200 text-gray-900'}`}>
                            <div className="text-sm">{msg.role === 'user' ? <p className="whitespace-pre-wrap">{msg.content}</p> : renderMessageContent(msg.content)}</div>
                            <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-blue-100' : msg.role === 'error' ? 'text-red-600' : 'text-gray-500'}`}>{msg.timestamp}</div>
                          </div>
                        </div>
                      ))}
                      {isLoading && <div className="flex justify-start"><div className="bg-white border rounded-lg p-4"><div className="flex items-center gap-2 text-gray-600"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Thinking...</span></div></div></div>}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 p-4 bg-white">
                  {uploadedFile && (
                    <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <FileJson className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-900 flex-1">{uploadedFile.name}</span>
                      <button onClick={() => setUploadedFile(null)} className="text-blue-600 hover:text-blue-800"><X className="w-4 h-4" /></button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json,.txt,.xlsx" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors" disabled={isLoading}><Upload className="w-5 h-5 text-gray-600" /></button>
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()} placeholder="Describe your ABAP requirements..." className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" disabled={isLoading} />
                    <Button onClick={handleSendMessage} variant="primary" icon={isLoading ? Loader2 : Send} disabled={(!input.trim() && !uploadedFile) || isLoading}>{isLoading ? 'Sending...' : 'Send'}</Button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 text-center">💡 Drag & drop JSON/TXT/XLSX files onto upload button</div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button onClick={() => { if (lastCodeBlock) { navigator.clipboard.writeText(lastCodeBlock); addToast({ message: 'Code copied!', type: 'success' }); } else addToast({ message: 'No code yet', type: 'info' }); }} variant="outline" size="sm" icon={Copy} className="w-full justify-start">Copy Code</Button>
                  <Button onClick={() => { if (lastCodeBlock) { const blob = new Blob([lastCodeBlock], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'generated_code.abap'; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url); addToast({ message: 'Downloaded!', type: 'success' }); } else addToast({ message: 'No code yet', type: 'info' }); }} variant="outline" size="sm" icon={Download} className="w-full justify-start">Download .abap</Button>
                  <Button onClick={() => { setMessages([]); setLastCodeBlock(''); setInput(''); setUploadedFile(null); setThreadId(null); addToast({ message: 'Chat cleared!', type: 'success' }); }} variant="outline" size="sm" icon={RefreshCw} className="w-full justify-start">New Generation</Button>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Pro Tips</h4>
                  <ul className="text-xs text-gray-600 space-y-2">
                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Upload JSON templates for better results</span></li>
                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Provide specific field names and table references</span></li>
                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Ask for refinements or modifications</span></li>
                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">•</span><span>Request additional documentation</span></li>
                  </ul>
                </div>
                {threadId && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span>Connected</span></div>
                      <div className="font-mono text-[10px] break-all">Thread: {threadId.substring(0, 20)}...</div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatSection;
