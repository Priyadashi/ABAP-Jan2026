import React from 'react';
import { Download, FileEdit, Upload, CheckCircle, Sparkles } from 'lucide-react';
import Card from './Card';

const steps = [
  {
    number: '01',
    title: 'Download Template',
    description: 'Choose your RICEF type (Report, Interface, Conversion, Enhancement, or Form) and download the specification template',
    icon: Download,
    color: 'from-blue-500 to-blue-600',
  },
  {
    number: '02',
    title: 'Fill Specifications',
    description: 'Complete the template with your functional requirements, data sources, and business logic',
    icon: FileEdit,
    color: 'from-purple-500 to-purple-600',
  },
  {
    number: '03',
    title: 'Upload & Generate',
    description: 'Upload your filled template to the AI assistant below and receive production-ready ABAP code',
    icon: Upload,
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    number: '04',
    title: 'Refine & Download',
    description: 'Review the code, provide feedback if needed, and copy or download your ABAP program',
    icon: CheckCircle,
    color: 'from-green-500 to-green-600',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Generate professional ABAP code in four simple steps
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-6xl mx-auto">
          {/* Desktop view - Horizontal timeline */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Connection line */}
              <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-20"></div>

              <div className="grid grid-cols-4 gap-8">
                {steps.map((step, index) => (
                  <div key={index} className="relative">
                    {/* Icon circle */}
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-10 h-10 text-white" />
                    </div>

                    {/* Step number */}
                    <div className="text-center mb-4">
                      <span className={`text-4xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}>
                        {step.number}
                      </span>
                    </div>

                    {/* Content */}
                    <Card className="text-center h-full">
                      <h3 className="text-xl font-bold mb-3 text-gray-900">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile view - Vertical timeline */}
          <div className="lg:hidden space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="relative pl-20">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className={`absolute left-10 top-20 bottom-0 w-1 bg-gradient-to-b ${step.color} opacity-20 -mb-8`}></div>
                )}

                {/* Icon circle */}
                <div className={`absolute left-0 top-0 w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <Card>
                  <div className="mb-2">
                    <span className={`text-3xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}>
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Ready in minutes, not hours</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
