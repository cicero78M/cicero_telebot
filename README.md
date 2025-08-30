# Cicero Telebot

Telegram bot built with Node.js to replace the WhatsApp bot used by the [Cicero_V2](https://github.com/cicero78M/Cicero_V2) backend.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and adjust values:
   ```ini
   TELEGRAM_BOT_TOKEN=your-telegram-token
   BACKEND_URL=http://localhost:3000/api
   PORT=3001
   ```
3. Run the bot:
   ```bash
   npm start
   ```

## Features
- Command `/analytics <CLIENT_ID>`: fetch analytics data from the backend.
- HTTP endpoint `POST /notify` for the backend to push messages to Telegram users.

## License
MIT
