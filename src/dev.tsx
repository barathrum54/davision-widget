import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatbotWidget from './components/ChatbotWidget/ChatbotWidget';

// Dev entry point for testing
const DevApp: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Chatbot Widget Development</h1>
      <p>This page is for testing the chatbot widget during development.</p>
      
      <ChatbotWidget config={{
        title: 'Nova',
        subtitle: 'AI Shopping Assistant',
        welcomeMessage: 'Welcome I am Eve, how can I assist you?',
        enableVoice: true,
        persistMessages: true,
      }} />
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<DevApp />);
}
