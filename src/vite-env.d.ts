/// <reference types="vite/client" />

import type { WidgetConfig } from "./types/config.types";

interface ChatbotWidget {
  init: (config?: Partial<WidgetConfig>) => void;
  destroy: () => void;
  toggle: () => void;
}

interface Window {
  ChatbotWidget: ChatbotWidget;
}
