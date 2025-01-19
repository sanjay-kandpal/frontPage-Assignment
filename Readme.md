# Hacker News Newsletter Service

## 📌 Table of Contents
- [Frontend Testing](#frontend-testing)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Usage Examples](#usage-examples)
- [Email Templates](#email-templates)
- [Development](#development)

## ✨ Features
* `Real-time updates` - Get instant story updates via WebSocket
* `Newsletters` - Automated daily and weekly email digests
* `Story scraping` - Automatic content collection from Hacker News
* `Subscription system` - Email-based subscription with confirmation
* `Live stats` - Real-time statistics and updates

## 🔧 Prerequisites
* Node.js (v14 or higher)
* MySQL (v5.7 or higher)
* Gmail account for sending emails

## 🔗 Frontend Testing

For testing the functionality of this service, you can use our companion frontend application:
* Frontend Repository: [frontend-Newsletter](https://github.com/sanjay-kandpal/frontend-Newsletter)

### Setup Frontend
```bash
# Clone the frontend repository
git clone https://github.com/sanjay-kandpal/frontend-Newsletter
cd frontend-Newsletter

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend provides:
* Newsletter subscription form
* Real-time story updates via WebSocket
* Visual display of Hacker News stories
* Subscription management interface

Make sure both the backend and frontend servers are running:
* Backend: `http://localhost:3000`
* Frontend: Default React port `http://localhost:3000` (will prompt to use different port)
* WebSocket: `ws://localhost:8080`

## 🚀 Installation

### 1. Clone & Install
```bash
git clone <repository-url>
cd hacker-news-newsletter
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Configure Environment
```env
# Server Configuration
SERVER_PORT=3000
WS_PORT=8080

# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=hackernews

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

### 4. Database Initialization
```sql
mysql -u your_db_user -p
CREATE DATABASE hackernews;
```

### 5. Start Application
```bash
npm start
```

## 📚 API Documentation

### REST API

#### Subscribe to Newsletter
```http
POST /subscribe
Content-Type: application/json

{
    "email": "user@example.com"
}
```

**Response:**
```json
{
    "message": "Subscription successful"
}
```

#### Confirm Subscription
```http
GET /confirm?token=<confirmation_token>
```

### WebSocket API

#### Connection
```javascript
const ws = new WebSocket('ws://localhost:8080');
```

#### Message Types

##### 1. Initial Connection
```javascript
{
    "type": "initial",
    "count": 10,
    "message": "10 stories published in the last 5 minutes"
}
```

##### 2. Story Updates
```javascript
{
    "type": "update",
    "stories": [
        {
            "id": 12345,
            "title": "Example Story",
            "url": "https://example.com",
            "points": 100,
            "author": "user123"
        }
    ]
}
```

## 💡 Usage Examples

### REST API Subscription
```javascript
const response = await fetch('http://localhost:3000/subscribe', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'user@example.com'
    })
});
const data = await response.json();
console.log(data.message);
```

### WebSocket Client (Browser)
```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
    console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch(data.type) {
        case 'initial':
            console.log('Recent stories:', data.message);
            break;
        case 'update':
            console.log('New stories:', data.stories);
            break;
    }
};
```

### WebSocket Client (Node.js)
```javascript
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    console.log('Connected to WebSocket server');
});

ws.on('message', (data) => {
    const message = JSON.parse(data);
    console.log('Received:', message);
});
```

## 📧 Email Templates

### Daily Newsletter
* Sent daily at 6:00 PM
* Contains new stories since last check
* Includes story details and metrics

### Weekly Newsletter
* Sent Sundays at 8:00 AM
* Features top 5 weekly stories
* Sorted by popularity

## 🛠 Development

### Project Structure
```
├── config/
│   ├── database.js
│   ├── email.js
│   ├── env.js
│   └── server.js
├── services/
│   ├── database.js
│   ├── mailer.js
│   ├── scraper.js
│   └── websocket.js
├── controllers/
│   ├── newsletter.js
│   └── subscription.js
├── routes/
│   └── index.js
├── .env
└── app.js
```


### Troubleshooting

#### Port Conflicts
If you're running both frontend and backend:
1. Backend should start first on port 3000
2. When starting frontend, React will detect port 3000 is in use and ask to use a different port
3. Type 'y' to allow it to use an alternative port (usually 3001)

#### WebSocket Connection
If WebSocket connection fails:
1. Ensure backend is running and WebSocket server is active on port 8080
2. Check browser console for connection errors
3. Verify WebSocket URL in frontend configuration matches backend

#### Email Sending
1. Make sure you've configured Gmail with an App Password
2. Enable "Less secure app access" in Gmail settings
3. Verify email configuration in `.env`

### Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License
[MIT License](LICENSE)