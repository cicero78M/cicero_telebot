import { Telegraf } from 'telegraf';
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is not defined');
  process.exit(1);
}

const bot = new Telegraf(token);

// Command: /start
bot.start(ctx => {
  ctx.reply('Selamat datang di Cicero Telegram Bot!\nGunakan /analytics <CLIENT_ID> untuk melihat data analitik.');
});

// Command: /analytics CLIENT_ID
bot.command('analytics', async ctx => {
  const parts = ctx.message.text.split(' ');
  const clientId = parts[1];
  if (!clientId) {
    return ctx.reply('Format: /analytics <CLIENT_ID>');
  }
  try {
    const url = `${process.env.BACKEND_URL || 'http://localhost:3000/api'}/analytics`;
    const res = await axios.get(url, { params: { client_id: clientId } });
    const data = JSON.stringify(res.data, null, 2);
    // Telegram limit ~4096 chars per message
    if (data.length > 4000) {
      ctx.reply(data.slice(0, 4000) + '\n...');
    } else {
      ctx.reply(data);
    }
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    ctx.reply(`Gagal mengambil data: ${msg}`);
  }
});

// Express server to allow backend to send messages via HTTP
const app = express();
app.use(express.json());

app.post('/notify', async (req, res) => {
  const { chatId, message } = req.body;
  if (!chatId || !message) {
    return res.status(400).json({ error: 'chatId and message required' });
  }
  try {
    await bot.telegram.sendMessage(chatId, message);
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Telegram bot server listening on port ${port}`);
  bot.launch();
});

// Graceful shutdown
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  process.exit();
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  process.exit();
});
