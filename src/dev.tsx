import React from "react";
import { createRoot } from "react-dom/client";
import ChatbotWidget from "./components/ChatbotWidget";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<ChatbotWidget />);
}
