import React from "react";
import { createRoot } from "react-dom/client";
import ChatbotWidget from "./components/ChatbotWidget";
import "./App.css";
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<ChatbotWidget />);
}
