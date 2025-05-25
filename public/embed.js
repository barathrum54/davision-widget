(function() {
  // Configuration
  const defaultConfig = {
    apiEndpoint: 'https://api.example.com/chat',
    analyticsEndpoint: 'https://api.example.com/analytics',
    welcomeMessage: 'Hello! How can I help you today?',
    quickReplies: [
      { id: '1', text: 'What products do you have?' },
      { id: '2', text: 'How can I order?' },
      { id: '3', text: 'What is your return policy?' },
      { id: '4', text: 'Where is my order?' },
      { id: '5', text: 'Contact customer service' }
    ]
  };

  // Load the widget script
  function loadScript(callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    
    // Use local path for development, production URL otherwise
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // For local development, load directly from the dev server
    if (isDev) {
      const port = 5175; // Update this to match your development server port
      script.src = `http://localhost:${port}/src/main.tsx`;
      
      // Create a module script to import the Vite client for HMR
      const moduleScript = document.createElement('script');
      moduleScript.type = 'module';
      moduleScript.src = `http://localhost:${port}/@vite/client`;
      document.head.appendChild(moduleScript);
      
      // Create a module script to import the React app directly
      const appScript = document.createElement('script');
      appScript.type = 'module';
      appScript.innerHTML = `
        import { init } from 'http://localhost:${port}/src/main.tsx';
        window.ChatbotWidget = { init };
        window.addEventListener('DOMContentLoaded', () => {
          init(${JSON.stringify(getScriptConfig())});
        });
      `;
      document.head.appendChild(appScript);
      
      // Skip the regular callback since we're initializing directly
      return;
    } else {
      script.src = 'https://chatbot.tbdr.dev/embed/chatbot-widget.umd.cjs';
    }
    
    script.async = true;
    script.onload = callback;
    document.head.appendChild(script);
  }

  // Initialize the widget once script is loaded
  function initWidget(config) {
    if (window.ChatbotWidget) {
      window.ChatbotWidget.init(config);
    } else {
      console.error('ChatbotWidget failed to load');
    }
  }

  // Get script tag data attributes
  function getScriptConfig() {
    const scripts = document.getElementsByTagName('script');
    const currentScript = scripts[scripts.length - 1];
    
    let config = {};
    
    if (currentScript.hasAttribute('data-config')) {
      try {
        config = JSON.parse(currentScript.getAttribute('data-config'));
      } catch (e) {
        console.error('Invalid config JSON', e);
      }
    }
    
    return { ...defaultConfig, ...config };
  }

  // Main initialization
  function main() {
    const config = getScriptConfig();
    loadScript(function() {
      initWidget(config);
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})(); 