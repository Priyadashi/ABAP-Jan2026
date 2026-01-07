import React from 'react';
import { ToastProvider } from './components/Toast';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import TemplateLibrary from './components/TemplateLibrary';
import ChatSectionN8n from './components/ChatSectionN8n';
import FeatureCards from './components/FeatureCards';
import Footer from './components/Footer';

function App() {
    return (
        <ToastProvider>
            <div className="min-h-screen">
                <Hero />
                <HowItWorks />
                <TemplateLibrary />
                <ChatSectionN8n />
                <FeatureCards />
                <Footer />
            </div>
        </ToastProvider>
    );
}

export default App;
