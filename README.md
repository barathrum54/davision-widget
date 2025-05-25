# Davision Chatbot Widget

A lightweight, customizable, and accessible chatbot widget for any website.

## Features

- 🎨 Fully customizable theme
- 📱 Responsive design
- ♿ Accessibility compliant
- 🔒 Style isolation (Shadow DOM)
- 💾 Message persistence
- 🎤 Voice input support (optional)
- 📎 File upload support (optional)
- 🌐 Internationalization ready
- ⚡ Lightweight (~50KB gzipped)

## Installation

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@davision/chatbot-widget@latest/dist/chatbot-widget.js"></script>
<script>
  window.ChatbotWidget.init({
    title: 'Support Chat',
    theme: {
      primaryColor: '#007bff',
      secondaryColor: '#6c757d'
    }
  });
</script>
```

### Auto-initialization

```html
<script 
  src="https://cdn.jsdelivr.net/npm/@davision/chatbot-widget@latest/dist/chatbot-widget.js"
  data-auto-init
  data-config='{"title": "Support Chat"}'
></script>
```

### Via NPM

```bash
npm install @davision/chatbot-widget
```

```javascript
import { ChatbotWidget } from '@davision/chatbot-widget';

ChatbotWidget.init({
  title: 'Support Chat',
  apiEndpoint: 'https://api.example.com/chat'
});
