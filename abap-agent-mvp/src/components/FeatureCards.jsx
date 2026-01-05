import React from 'react';
import { ShieldCheck, Rocket, Repeat } from 'lucide-react';
import Card from './Card';

const features = [
  {
    title: 'SAP Best Practices',
    description: 'Generated code follows Clean ABAP principles, performance guidelines, and security standards',
    icon: ShieldCheck,
    color: 'from-blue-500 to-blue-600',
    benefits: [
      'Clean ABAP compliance',
      'Optimized performance',
      'Security best practices',
      'Proper naming conventions',
    ],
  },
  {
    title: 'Production Ready',
    description: 'Complete with error handling, authorization checks, and comprehensive documentation',
    icon: Rocket,
    color: 'from-purple-500 to-purple-600',
    benefits: [
      'Error handling included',
      'Authorization checks',
      'Inline documentation',
      'Ready to transport',
    ],
  },
  {
    title: 'Iterative Refinement',
    description: 'Provide feedback directly in chat to refine and improve generated code',
    icon: Repeat,
    color: 'from-green-500 to-green-600',
    benefits: [
      'Interactive refinement',
      'Multiple iterations',
      'Custom modifications',
      'Real-time feedback',
    ],
  },
];

const FeatureCards = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Why Choose Our AI Assistant?
          </h2>
          <p className="text-lg text-gray-600">
            Enterprise-grade ABAP code generation with AI precision
          </p>
        </div>

        {/* Features grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} hover className="text-center">
              {/* Icon */}
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform duration-300`}>
                <feature.icon className="w-10 h-10 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>

              {/* Benefits list */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <ul className="space-y-2 text-sm text-left">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${feature.color}`}></div>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="animate-fade-in">
            <div className="text-4xl font-bold text-gradient mb-2">95%</div>
            <p className="text-gray-600">Code Quality Score</p>
          </div>
          <div className="animate-fade-in delay-100">
            <div className="text-4xl font-bold text-gradient mb-2">10x</div>
            <p className="text-gray-600">Faster Development</p>
          </div>
          <div className="animate-fade-in delay-200">
            <div className="text-4xl font-bold text-gradient mb-2">100%</div>
            <p className="text-gray-600">SAP Compliant</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
