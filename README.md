# Davision Chatbot Widget

A lightweight, customizable, and accessible chatbot widget designed to be embedded into any website with a single line of code.

## Features

- 🎨 **Fully customizable:** Theme, colors, messages, and behavior
- 📱 **Responsive design:** Works on all devices and screen sizes
- ♿ **Accessibility compliant:** ARIA attributes, keyboard navigation, and screen reader support
- 🔒 **Style isolation:** Uses Shadow DOM to prevent style conflicts
- 💾 **Message persistence:** Optionally save conversation history
- 🎤 **Voice input:** Optional speech recognition capability
- 🖼️ **Product carousel:** Display product recommendations
- 🔄 **Retry mechanism:** Graceful error handling with retry functionality
- ⚡ **Lightweight:** Optimized for minimal bundle size
- 📦 **No dependencies:** Self-contained with React bundled in

## Installation

### Option 1: Direct Script Tag

Add this to your HTML:

```html
<script src="https://cdn.example.com/chatbot-widget.js"></script>
<script>
  window.ChatbotWidget.init({
    title: 'Nova',
    welcomeMessage: 'Hello! How can I assist you today?'
  });
</script>
```

### Option 2: Auto-initialization

```html
<script 
  src="https://cdn.example.com/chatbot-widget.js"
  data-auto-init
  data-config='{"title": "Nova", "welcomeMessage": "Hello! How can I assist you today?"}'
></script>
```

### Option 3: NPM Package

```bash
npm install @davision/chatbot-widget
```

```javascript
import { ChatbotWidget } from '@davision/chatbot-widget';

ChatbotWidget.init({
  title: 'Nova',
  welcomeMessage: 'Hello! How can I assist you today?'
});
```

## Configuration Options

```javascript
ChatbotWidget.init({
  // Appearance
  title: 'Nova',                           // Widget title
  subtitle: 'AI Shopping Assistant',       // Subtitle displayed under title
  position: 'bottom-right',                // Widget position: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
  avatarSrc: '/path/to/avatar.png',        // Avatar image URL
  logoSrc: '/path/to/logo.png',            // Company logo URL

  // Messages
  welcomeMessage: 'How can I help you?',   // Initial message
  placeholder: 'Ask me anything...',       // Input placeholder

  // Features
  enableVoice: true,                       // Enable voice input button
  enableFileUpload: false,                 // Enable file upload button
  maxMessageLength: 500,                   // Maximum message length
  persistMessages: true,                   // Save messages to localStorage
  productCarouselEnabled: true,            // Enable product carousel

  // API Integration
  apiEndpoint: 'https://api.example.com/chat',
  apiKey: 'YOUR_API_KEY',
  headers: {                               // Custom headers for API requests
    'X-Custom-Header': 'value'
  },

  // Theming
  theme: {
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    backgroundColor: '#f8f9fa',
    textColor: '#212529',
    borderRadius: '16px',
    fontFamily: 'Arial, sans-serif',
    fontSize: {
      small: '12px',
      medium: '14px',
      large: '16px'
    },
    messageColors: {
      user: '#007bff',
      bot: '#f1f0f0'
    }
  },

  // Quick Replies
  quickReplies: [
    { id: '1', text: 'What are your business hours?' },
    { id: '2', text: 'How can I contact support?' }
  ]
});
```

## API Methods

```javascript
// Initialize widget with configuration
ChatbotWidget.init(config);

// Destroy the widget completely
ChatbotWidget.destroy();

// Programmatically toggle widget visibility
ChatbotWidget.toggle();
```

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`
5. Test production build: `npm run preview`

## Browser Compatibility

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- iOS Safari: 11+
- Android Chrome: 80+

## Accessibility

The widget is built with accessibility in mind:
- ARIA attributes for screen readers
- Keyboard navigation support
- Focus management
- Color contrast compliance

## Project Structure

```
src/
├── components/       # React components
├── context/          # React context for state management
├── hooks/            # Custom React hooks
├── services/         # API and storage services
├── styles/           # Global styles and themes
├── types/            # TypeScript interfaces and types
├── utils/            # Utility functions
└── main.tsx          # Entry point
```

## License

MIT License

## Single-File Implementation

This chatbot widget is implemented as a single, self-contained JavaScript file with everything bundled together:

- JavaScript code
- CSS styles
- Base64-encoded images
- Auto-initialization logic

### How to Use

To add this widget to any website, simply include the script tag:

```html
<script src="chatbot-widget.umd.cjs"></script>
```

That's it! The widget automatically initializes without any additional steps.

### Key Features

- **Plug-and-Play**: No manual initialization required
- **Self-Contained**: No external dependencies or separate CSS files
- **Secure**: Uses iframe for isolation
- **Responsive**: Works on all device sizes
- **Lightweight**: Single file, optimized for production

### Directory Structure

The production build is available in the `dist-clean` directory:

- `chatbot-widget.umd.cjs` - The single file containing everything
- `test.html` - A test page to verify the widget works correctly
