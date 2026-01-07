import React, { useState, useRef, useEffect } from 'react';
import { Lightbulb, Copy, Download, RefreshCw, Upload, Send, FileJson, X, MessageSquare, Loader2, Zap } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { useToast } from './Toast';

// Automatically detect API URL for GitHub Codespaces
const getApiUrl = () => {
    // Check if explicitly set in env
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // Check if running in GitHub Codespaces (various URL patterns)
    const hostname = window.location.hostname;
    const origin = window.location.origin;

    // Pattern: xxx-5173.app.github.dev or xxx-5173.preview.app.github.dev
    if (hostname.includes('github.dev') || hostname.includes('githubpreview.dev')) {
        // Replace the port number in the hostname
        const backendUrl = origin.replace(/-5173\./, '-8000.');
        console.log('[n8n] Codespaces detected, backend URL:', backendUrl);
        return backendUrl;
    }

    // Default to localhost
    console.log('[n8n] Using localhost backend');
    return 'http://localhost:8000';
};

const API_URL = getApiUrl();

const ChatSectionN8n = () => {
    const { addToast } = useToast();
    const [messages, setMessages] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastCodeBlock, setLastCodeBlock] = useState('');
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const extractCodeBlocks = (content) => {
        if (!content) return;

        // First try to find markdown code blocks
        const codeBlockRegex = /```(?:abap)?[\n\r]?([\s\S]*?)```/g;
        const matches = [...content.matchAll(codeBlockRegex)];

        if (matches.length > 0) {
            // Found markdown code blocks - use the last one
            setLastCodeBlock(matches[matches.length - 1][1].trim());
        } else {
            // No markdown blocks - check if the content looks like ABAP code
            // (contains common ABAP keywords or starts with REPORT/DATA/etc.)
            const abapKeywords = /\b(REPORT|DATA|SELECT|ENDSELECT|LOOP|ENDLOOP|IF|ENDIF|WRITE|PERFORM|FORM|ENDFORM|CLASS|ENDCLASS|METHOD|ENDMETHOD|FUNCTION|ENDFUNCTION|START-OF-SELECTION|END-OF-SELECTION|TABLES|TYPES|CONSTANTS)\b/i;
            if (abapKeywords.test(content)) {
                // Treat entire content as code
                setLastCodeBlock(content.trim());
            }
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
        if (!uploadedFile) {
            addToast({ message: 'Please upload a file first', type: 'info' });
            return;
        }

        const userMessage = {
            role: 'user',
            content: `📁 Uploaded: ${uploadedFile?.name}`,
            timestamp: new Date().toLocaleTimeString(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', uploadedFile);

            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to get response from n8n workflow');
            }

            const data = await response.json();

            if (data.content) {
                extractCodeBlocks(data.content);
            }

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.content || 'No response from workflow',
                timestamp: new Date().toLocaleTimeString(),
                success: data.success,
            }]);

            if (data.success) {
                addToast({ message: 'n8n workflow completed!', type: 'success' });
            } else {
                addToast({ message: data.error || 'Workflow returned with issues', type: 'warning' });
            }
        } catch (error) {
            addToast({ message: `Error: ${error.message}`, type: 'error' });
            setMessages(prev => [...prev, {
                role: 'error',
                content: `⚠️ Connection error. Check backend is running.\n\nError: ${error.message}`,
                timestamp: new Date().toLocaleTimeString(),
            }]);
        } finally {
            setIsLoading(false);
            setUploadedFile(null);
        }
    };

    const renderMessageContent = (content) => {
        const parts = [];
        let lastIndex = 0;
        const codeBlockRegex = /```(?:abap)?[\n\r]?([\s\S]*?)```/g;
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
                    <p className="text-lg text-gray-600">Powered by n8n Workflow • Upload your functional specifications</p>
                </div>

                <div className="max-w-4xl mx-auto mb-8">
                    <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-bold text-gray-900 mb-2">⚡ n8n Workflow Mode</h4>
                                <p className="text-gray-700 leading-relaxed">Upload your Excel (.xlsx) functional specifications. The file is sent to an n8n workflow which processes it and returns generated ABAP code.</p>
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
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-yellow-600 flex items-center justify-center mb-4">
                                                <Zap className="w-10 h-10 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">n8n Workflow Integration</h3>
                                            <p className="text-gray-600 max-w-md mb-4">Upload an Excel file with functional specifications to generate ABAP code</p>
                                            <div className="text-sm text-gray-500">Workflow powered by n8n automation</div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {messages.map((msg, idx) => (
                                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[85%] rounded-lg p-4 ${msg.role === 'user' ? 'bg-gradient-to-r from-orange-500 to-yellow-600 text-white' : msg.role === 'error' ? 'bg-red-50 border border-red-200 text-red-900' : 'bg-white border border-gray-200 text-gray-900'}`}>
                                                        <div className="text-sm">{msg.role === 'user' ? <p className="whitespace-pre-wrap">{msg.content}</p> : renderMessageContent(msg.content)}</div>
                                                        <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-orange-100' : msg.role === 'error' ? 'text-red-600' : 'text-gray-500'}`}>{msg.timestamp}</div>
                                                    </div>
                                                </div>
                                            ))}
                                            {isLoading && <div className="flex justify-start"><div className="bg-white border rounded-lg p-4"><div className="flex items-center gap-2 text-gray-600"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Processing with n8n workflow...</span></div></div></div>}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-gray-200 p-4 bg-white">
                                    {uploadedFile && (
                                        <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                                            <FileJson className="w-4 h-4 text-orange-600" />
                                            <span className="text-sm text-orange-900 flex-1">{uploadedFile.name}</span>
                                            <button onClick={() => setUploadedFile(null)} className="text-orange-600 hover:text-orange-800"><X className="w-4 h-4" /></button>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json,.txt,.xlsx" className="hidden" />
                                        <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors" disabled={isLoading}><Upload className="w-5 h-5 text-gray-600" /></button>
                                        <div className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-500 text-sm flex items-center">
                                            {uploadedFile ? `Ready to process: ${uploadedFile.name}` : 'Upload an Excel file to begin...'}
                                        </div>
                                        <Button onClick={handleSendMessage} variant="primary" icon={isLoading ? Loader2 : Send} disabled={!uploadedFile || isLoading} className="bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700">{isLoading ? 'Processing...' : 'Process'}</Button>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500 text-center">⚡ Files are sent to n8n workflow for processing</div>
                                </div>
                            </Card>
                        </div>

                        <div className="lg:col-span-1">
                            <Card>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Button onClick={() => { if (lastCodeBlock) { navigator.clipboard.writeText(lastCodeBlock); addToast({ message: 'Code copied!', type: 'success' }); } else addToast({ message: 'No code yet', type: 'info' }); }} variant="outline" size="sm" icon={Copy} className="w-full justify-start">Copy Code</Button>
                                    <Button onClick={() => { if (lastCodeBlock) { const blob = new Blob([lastCodeBlock], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'generated_code.abap'; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url); addToast({ message: 'Downloaded!', type: 'success' }); } else addToast({ message: 'No code yet', type: 'info' }); }} variant="outline" size="sm" icon={Download} className="w-full justify-start">Download .abap</Button>
                                    <Button onClick={() => { setMessages([]); setLastCodeBlock(''); setUploadedFile(null); addToast({ message: 'Chat cleared!', type: 'success' }); }} variant="outline" size="sm" icon={RefreshCw} className="w-full justify-start">New Generation</Button>
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="text-sm font-bold text-gray-900 mb-2">How It Works</h4>
                                    <ul className="text-xs text-gray-600 space-y-2">
                                        <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">1.</span><span>Upload Excel with specifications</span></li>
                                        <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">2.</span><span>File is sent to n8n workflow</span></li>
                                        <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">3.</span><span>Workflow processes and generates code</span></li>
                                        <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">4.</span><span>ABAP code is returned and displayed</span></li>
                                    </ul>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="text-xs text-gray-500">
                                        <div className="flex items-center gap-2 mb-1"><Zap className="w-3 h-3 text-orange-500" /><span>n8n Workflow Mode</span></div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ChatSectionN8n;
