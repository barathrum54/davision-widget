// Development version of the widget loader
// This script loads the actual React widget from the development server

(function () {
  const config = {
    apiEndpoint: "https://api.example.com/chat",
    analyticsEndpoint: "https://api.example.com/analytics",
    welcomeMessage: "Hello! How can I help you today?",
    quickReplies: [
      { id: "1", text: "What products do you have?" },
      { id: "2", text: "How can I order?" },
      { id: "3", text: "What is your return policy?" },
      { id: "4", text: "Where is my order?" },
      { id: "5", text: "Contact customer service" },
    ],
  };

  // Detect dev server port - default to 5174, but could be different
  const getDevServerPort = () => {
    // Check common Vite ports starting from 5173
    for (let port = 5173; port < 5180; port++) {
      try {
        const img = new Image();
        img.src = `http://localhost:${port}/favicon.ico?_=${Date.now()}`;
        if (img.complete) return port;
      } catch (e) {
        // Ignore errors
      }
    }
    return 5174; // Default fallback
  };

  const port = getDevServerPort();

  // Create a container for the widget
  const container = document.createElement("div");
  container.id = "dev-widget-root";
  document.body.appendChild(container);

  // Function to load the actual widget
  const loadWidget = () => {
    // Create script to load React from the dev server
    const script = document.createElement("script");
    script.type = "module";
    script.innerHTML = `
      import React from 'http://localhost:${port}/node_modules/react/index.js';
      import ReactDOM from 'http://localhost:${port}/node_modules/react-dom/index.js';
      import ChatbotWidget from 'http://localhost:${port}/src/components/ChatbotWidget/ChatbotWidget.jsx';
      
      // Create widget container
      const widgetContainer = document.createElement('div');
      widgetContainer.id = 'chatbot-widget-container';
      document.getElementById('dev-widget-root').appendChild(widgetContainer);
      
      // Render the widget
      ReactDOM.createRoot(widgetContainer).render(
        React.createElement(ChatbotWidget, { config: ${JSON.stringify(
          config
        )} })
      );
    `;

    // Add error handling
    script.onerror = () => {
      console.error(`Failed to load widget from dev server at port ${port}`);
      showFallbackWidget();
    };

    document.head.appendChild(script);
  };

  // Fallback to a simple button if loading fails
  const showFallbackWidget = () => {
    // Apply basic styles
    const style = document.createElement("style");
    style.textContent = `
      #dev-widget-root {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
      }
      
      .dev-chatbot-button {
        background-color: #007bff;
        color: white;
        border-radius: 50%;
        height: 60px;
        width: 60px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        padding: 0;
      }
    `;
    document.head.appendChild(style);

    // Create a button
    const button = document.createElement("button");
    button.className = "dev-chatbot-button";
    button.innerHTML =
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12C2 13.85 2.5 15.55 3.35 17L2 22L7 20.65C8.45 21.5 10.15 22 12 22C17.52 22 22 17.52 22 12S17.52 2 12 2ZM12 20C10.35 20 8.85 19.5 7.55 18.7L7.2 18.5L4.5 19.5L5.5 16.8L5.3 16.45C4.5 15.15 4 13.65 4 12C4 7.59 7.59 4 12 4S20 7.59 20 12S16.41 20 12 20Z"></path></svg>';
    button.onclick = function () {
      alert(
        "Dev server not detected. Please ensure your Vite dev server is running."
      );
    };
    container.appendChild(button);
  };

  // Check if dev server is reachable
  fetch(`http://localhost:${port}/@vite/client`, { mode: "no-cors" })
    .then(() => {
      // Dev server is running, load the widget
      loadWidget();
    })
    .catch(() => {
      // Dev server not reachable, show fallback
      console.error(`Dev server not detected at port ${port}`);
      showFallbackWidget();
    });
})();
