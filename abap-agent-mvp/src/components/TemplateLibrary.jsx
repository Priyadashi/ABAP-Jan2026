import React from 'react';
import { FileText, GitBranch, RefreshCw, Wrench, Printer, Download } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { useToast } from './Toast';

const templates = [
  {
    id: 'report',
    name: 'Report',
    icon: FileText,
    description: 'Generate ALV reports, list outputs, and custom data extracts with selection screens',
    color: 'from-blue-500 to-blue-600',
    file: '/templates/report_template.json',
  },
  {
    id: 'interface',
    name: 'Interface',
    icon: GitBranch,
    description: 'Create IDoc, RFC, API, or file-based integrations with error handling',
    color: 'from-purple-500 to-purple-600',
    file: '/templates/interface_template.json',
  },
  {
    id: 'conversion',
    name: 'Conversion',
    icon: RefreshCw,
    description: 'Build LSMW, BDC, or direct input programs for data migration',
    color: 'from-indigo-500 to-indigo-600',
    file: '/templates/conversion_template.json',
  },
  {
    id: 'enhancement',
    name: 'Enhancement',
    icon: Wrench,
    description: 'Implement User Exits, BADIs, or Enhancement Spots with proper logic',
    color: 'from-green-500 to-green-600',
    file: '/templates/enhancement_template.json',
  },
  {
    id: 'form',
    name: 'Form',
    icon: Printer,
    description: 'Design Smartforms or Adobe Forms with layout and print programs',
    color: 'from-orange-500 to-orange-600',
    file: '/templates/form_template.json',
  },
];

const TemplateLibrary = () => {
  const { addToast } = useToast();

  const handleDownload = async (template) => {
    try {
      const response = await fetch(template.file);
      const data = await response.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.id}_template.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast({
        message: `${template.name} template downloaded successfully!`,
        type: 'success',
      });
    } catch (error) {
      addToast({
        message: 'Failed to download template. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <section id="templates-section" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            RICEF Template Library
          </h2>
          <p className="text-lg text-gray-600">
            Download pre-structured templates for your ABAP development needs
          </p>
        </div>

        {/* Template grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} hover className="flex flex-col">
              {/* Icon header */}
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-4 shadow-lg`}>
                <template.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                {template.name}
              </h3>
              <p className="text-gray-600 mb-6 flex-1 leading-relaxed">
                {template.description}
              </p>

              {/* Download button */}
              <Button
                onClick={() => handleDownload(template)}
                variant="outline"
                size="sm"
                icon={Download}
                className="w-full"
              >
                Download Template
              </Button>
            </Card>
          ))}
        </div>

        {/* Info box */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-blue-50 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  How to use templates
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  Download the template for your RICEF type, fill in all required fields with your specifications,
                  then upload it to the AI assistant below. The AI will analyze your requirements and generate
                  production-ready ABAP code following SAP best practices.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TemplateLibrary;
