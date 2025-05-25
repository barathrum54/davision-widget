ChatbotWidget.init({
  // Basic settings
  title: 'Chat Assistant',
  subtitle: 'How can I help you?',
  placeholder: 'Type your message...',
  welcomeMessage: 'Hello! How can I assist you today?2',
  
  // Position
  position: 'bottom-right', // 'bottom-left', 'top-right', 'top-left'
  
  // Theme
  theme: {
    primaryColor: '#007bff',
    secondaryColor: '#735a3c',
    backgroundColor: '#f1ece9',
    textColor: '#333333',
    borderRadius: '25px',
    fontFamily: 'Arial, sans-serif',
    fontSize: {
      small: '12px',
      medium: '14px',
      large: '16px'
    }
  },
  
  // Features
  enableVoice: false,
  enableFileUpload: false,
  maxMessageLength: 500,
  persistMessages: false,
  
  // API
  apiEndpoint: 'https://api.example.com/chat',
  apiHeaders: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
}); 