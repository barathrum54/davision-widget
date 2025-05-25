import { createRoot } from "react-dom/client";
import ChatbotWidget from "./components/ChatbotWidget";

function init() {
  // Ensure React and ReactDOM are available
  if (!window.React) {
    console.error("React not found. Please include React via CDN.");
    return;
  }
  if (!window.ReactDOM) {
    console.error("ReactDOM not found. Please include ReactDOM via CDN.");
    return;
  }

  try {
    // Create Shadow DOM
    const host = document.createElement("div");
    host.id = "chatbot-widget";
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: "open" });

    // Render React app in Shadow DOM
    const rootElement = document.createElement("div");
    shadow.appendChild(rootElement);
    const root = createRoot(rootElement);
    root.render(<ChatbotWidget />);
  } catch (error) {
    console.error("Failed to initialize ChatbotWidget:", error);
  }
}

// Attach to global window object
try {
  if (!window.Chatbot) {
    window.Chatbot = { init };
  } else {
    console.warn("window.Chatbot already exists. Overwriting.");
    window.Chatbot = { init };
  }
} catch (error) {
  console.error("Failed to set window.Chatbot:", error);
}

export default init;
