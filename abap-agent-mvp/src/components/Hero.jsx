import React from 'react';
import { Sparkles, ArrowDown } from 'lucide-react';
import Button from './Button';

const Hero = () => {
  const scrollToChat = () => {
    const chatSection = document.getElementById('chat-section');
    chatSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative gradient-primary text-white py-24 md:py-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">AI-Powered ABAP Code Generation</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in leading-tight">
            Generate Production-Ready
            <br />
            <span className="bg-white/20 px-4 py-2 rounded-lg inline-block mt-2">
              ABAP Code with AI
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto animate-fade-in leading-relaxed">
            Download templates, fill specifications, and get SAP-certified ABAP code in minutes
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button
              onClick={scrollToChat}
              variant="secondary"
              size="lg"
              icon={Sparkles}
              className="bg-white text-primary hover:bg-white/90 hover:shadow-2xl"
            >
              Start Generating
            </Button>
            <Button
              onClick={() => {
                const templatesSection = document.getElementById('templates-section');
                templatesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 backdrop-blur-sm"
            >
              View Templates
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 animate-bounce">
            <ArrowDown className="w-6 h-6 mx-auto opacity-70" />
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
