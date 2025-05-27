# Davision Chatbot Widget

A modern, responsive chatbot widget built with React and TypeScript. Features real-time messaging, voice input, product carousels, analytics tracking, and seamless integration into any website.

## ✨ Features

- **🎯 Plug & Play Integration** - Single script tag deployment
- **📱 Fully Responsive** - Optimized for desktop, tablet, and mobile
- **🎤 Voice Input** - Speech-to-text functionality (Turkish language support)
- **🛍️ Product Carousel** - Interactive product showcase with analytics
- **📊 Analytics Tracking** - Comprehensive user interaction analytics
- **🔄 Real-time Messaging** - Instant chat responses with retry functionality
- **🎨 Customizable UI** - Configurable themes and styling
- **⚡ Fast & Lightweight** - 305KB bundle (125KB gzipped)
- **🔒 CORS Proxy Support** - Built-in proxy for cross-origin requests
- **💾 Message Persistence** - Optional local storage for chat history
- **🌐 Offline Detection** - Graceful handling of network issues

## 🚀 Quick Start

### Basic Integration

Add this single line to your HTML:

```html
<script src="https://your-domain.com/chatbot-widget.umd.cjs"></script>
```

The widget will automatically initialize with default settings.

### Advanced Configuration

```html
<script
  src="https://your-domain.com/chatbot-widget.umd.cjs"
  data-auto-init="true"
  data-config='{"apiEndpoint": "https://api.example.com/chat", "enableVoice": true}'
></script>
```

### Programmatic Usage

```javascript
// Initialize with custom config
window.ChatbotWidget.init({
  apiEndpoint: "https://api.example.com/chat",
  analyticsEndpoint: "https://api.example.com/analytics",
  enableVoice: true,
  persistMessages: true,
  theme: {
    primaryColor: "#007bff",
    backgroundColor: "#f1ece9",
  },
});

// Control the widget
window.ChatbotWidget.toggle(); // Open/close
window.ChatbotWidget.destroy(); // Remove widget
```

## ⚙️ Configuration Options

| Option              | Type      | Default              | Description                       |
| ------------------- | --------- | -------------------- | --------------------------------- |
| `apiEndpoint`       | `string`  | `undefined`          | Chat API endpoint URL             |
| `analyticsEndpoint` | `string`  | `undefined`          | Analytics tracking endpoint       |
| `enableVoice`       | `boolean` | `false`              | Enable voice input functionality  |
| `persistMessages`   | `boolean` | `false`              | Save chat history to localStorage |
| `useProxy`          | `boolean` | `true`               | Use CORS proxy for API requests   |
| `corsProxy`         | `string`  | Built-in proxy       | Custom CORS proxy URL             |
| `maxMessageLength`  | `number`  | `500`                | Maximum message character limit   |
| `welcomeMessage`    | `string`  | Default message      | Initial bot greeting              |
| `placeholder`       | `string`  | "Ask me anything..." | Input field placeholder           |

### Theme Configuration

```javascript
{
  theme: {
    primaryColor: '#007bff',
    secondaryColor: '#735a3c',
    backgroundColor: '#f1ece9',
    textColor: '#333333',
    borderRadius: '25px',
    fontFamily: 'Roboto, sans-serif',
    messageColors: {
      user: '#735a3c',
      bot: '#ffffff'
    }
  }
}
```

## 📡 API Integration

### Chat API Format

**Request:**

```json
{
  "EventType": "send_message",
  "ButtonLabel": "keyboard_enter",
  "UserAgent": "Mozilla/5.0...",
  "ScreenResolution": "1920x1080",
  "OperatingSystem": "macOS",
  "DeviceType": "Desktop",
  "user_text": "Hello there",
  "RawPayload": {
    "timestamp": "2024-01-01T12:00:00.000Z",
    "sessionId": "session_1704110400000",
    "message": "Hello there"
  }
}
```

**Response:**

```json
{
  "response_type": 0,
  "text": "Hello! How can I help you?",
  "products": [
    {
      "id": "1",
      "title": "Product Name",
      "price": "99.99 ₺",
      "image": "https://example.com/image.jpg",
      "link": "https://example.com/product/1"
    }
  ]
}
```

### Button Label Tracking

The widget automatically tracks user interaction methods:

- `quick_reply` - User clicked a quick reply button
- `voice_button` - User used voice input
- `keyboard_enter` - User pressed Enter key
- `ui_submit` - User clicked send button
- `retry_message` - User clicked retry on failed message

### Analytics Database Schema

```sql
CREATE TABLE ChatInteractions (
    InteractionID INT AUTO_INCREMENT PRIMARY KEY,
    EventType VARCHAR(100) NOT NULL,
    ButtonLabel VARCHAR(255) NULL,
    UserAgent TEXT NULL,
    ScreenResolution VARCHAR(50) NULL,
    OperatingSystem VARCHAR(100) NULL,
    DeviceType VARCHAR(50) NULL,
    EventTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    RawPayload JSON NULL
);
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/davision-widget.git
cd davision-widget

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run type checking
npm run type-check
```

### Project Structure

```
src/
├── components/          # React components
│   ├── ChatbotWidget/   # Main widget container
│   ├── ChatbotButton/   # FAB button
│   ├── ChatbotInput/    # Message input with voice
│   ├── ChatbotMessages/ # Message display
│   └── ProductCarousel/ # Product showcase
├── services/            # API and analytics services
├── hooks/               # Custom React hooks
├── context/             # React context providers
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── styles/              # Shared styles and themes
├── assets/              # Base64 encoded images
├── main.tsx             # Production entry point
└── dev.tsx              # Development entry point
```

### Building

```bash
# Production build
npm run build

# Development build with watch
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📱 Responsive Behavior

### Desktop (≥1024px)

- FAB: 100×100px fixed position
- Chat: 340×600px overlay with smooth animations
- Full feature set including hover effects

### Mobile (<1024px)

- FAB: 100×100px fixed position
- Chat: Full viewport (100vw×100vh) with instant transitions
- Optimized touch interactions
- Simplified animations for better performance

## 🎨 Customization

### CSS Variables

The widget exposes CSS variables for easy theming:

```css
:root {
  --chatbot-primary-color: #007bff;
  --chatbot-secondary-color: #735a3c;
  --chatbot-background-color: #f1ece9;
  --chatbot-text-color: #333333;
  --chatbot-border-radius: 25px;
}
```

### Custom Styling

```javascript
window.ChatbotWidget.init({
  customStyles: {
    container: {
      borderRadius: "15px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    },
  },
});
```

## 🔧 Advanced Features

### Voice Input

Supports speech-to-text in Turkish with automatic language detection:

```javascript
{
  enableVoice: true,
  voiceLanguage: 'tr-TR' // Turkish (default)
}
```

### Message Persistence

```javascript
{
  persistMessages: true, // Saves to localStorage
  storageKey: 'custom_chat_history' // Optional custom key
}
```

### CORS Proxy

Built-in CORS proxy for cross-origin API requests:

```javascript
{
  useProxy: true,
  corsProxy: 'https://your-proxy.com/?url=' // Custom proxy
}
```

## 🚨 Error Handling

The widget includes comprehensive error handling:

- **Network Errors**: Automatic retry with user feedback
- **API Failures**: Graceful degradation with retry buttons
- **Offline Detection**: Real-time connectivity monitoring
- **Invalid Responses**: Fallback to default messages

## 📊 Analytics Events

Tracked events include:

- `send_message` - User sends a message
- `click_quick_reply` - Quick reply button clicked
- `open_chat` - Widget opened
- `close_chat` - Widget closed
- `view_product` - Product viewed in carousel
- `page_view` - Page navigation

## 🔒 Security

- **XSS Protection**: All user inputs are sanitized
- **CORS Handling**: Secure cross-origin request management
- **Content Security Policy**: Compatible with strict CSP
- **No External Dependencies**: Self-contained bundle

## 📈 Performance

- **Bundle Size**: 305KB (125KB gzipped)
- **Load Time**: <100ms on 3G networks
- **Memory Usage**: <10MB typical usage
- **CPU Impact**: Minimal, optimized animations

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Documentation**: [docs.davision.com](https://docs.davision.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/davision-widget/issues)
- **Email**: support@davision.com

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] File upload functionality
- [ ] Video call integration
- [ ] Advanced analytics dashboard
- [ ] A/B testing framework
- [ ] WordPress plugin
- [ ] Shopify integration

---

Made with ❤️ by [Davision](https://davision.com)
