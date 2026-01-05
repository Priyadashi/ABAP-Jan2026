import React, { useState } from 'react';
import { Lightbulb, Copy, Download, RefreshCw, MessageSquare } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { useToast } from './Toast';

const ChatSection = () => {
  const { addToast } = useToast();
  const [lastCodeBlock, setLastCodeBlock] = useState('');

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
    setLastCodeBlock('');
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
            {/* ChatKit placeholder - Main chat area */}
            <div className="lg:col-span-3">
              <Card padding="none" className="overflow-hidden">
                {/* ChatKit Integration Placeholder */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 min-h-[600px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <MessageSquare className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    ChatKit Integration Placeholder
                  </h3>
                  <p className="text-gray-600 text-center max-w-md mb-4">
                    Replace this section with the OpenAI ChatKit component once you have your agent ID.
                  </p>
                  <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm max-w-lg w-full">
                    <code className="block whitespace-pre-wrap">
{`import { ChatKit } from '@openai/chatkit';

<ChatKit
  agentId="wf_695b682cc6508190b4efd42040b8ee870d512e00ff2aae30"
  enableFileUpload={true}
  acceptedFileTypes={['.json']}
  placeholder="Upload your filled template..."
  theme="light"
  height="600px"
/>`}
                    </code>
                  </div>
                </div>
              </Card>
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
