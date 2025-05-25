/// <reference types="vite/client" />

interface Chatbot {
  init: () => void;
}

interface Window {
  Chatbot: Chatbot;
}
