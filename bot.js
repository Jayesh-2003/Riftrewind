// bot.js - Main bot entry point with webhook support
import 'dotenv/config';
import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import * as db from './db.js';
import * as handlers from './handlers.js';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const PORT = process.env.PORT || 3000;

// Determine if we're using webhook or polling
const useWebhook = WEBHOOK_URL && WEBHOOK_URL.trim().length > 0;

const botOptions = useWebhook
  ? { webHook: { port: PORT } }
  : { polling: true };

const bot = new TelegramBot(TOKEN, botOptions);

// Bot setup
bot.setMyCommands([
  { command: 'start', description: 'Register your League account' },
  { command: 'roast', description: 'Get roasted on your latest match' },
  { command: 'analysis', description: 'Detailed match history analysis with graphs' },
  { command: 'help', description: 'Show help information' },
]);

console.log('🤖 League Roaster Bot starting...');

// Connect to database
try {
  await db.connectDB();
} catch (error) {
  console.error('❌ Failed to connect to database:', error.message);
  console.error('Make sure MONGODB_URI is set in your .env file');
  process.exit(1);
}

// Handle /start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  console.log(`📨 /start command from user ${userId}`);
  
  try {
    await handlers.handleStartCommand(bot, chatId, userId);
  } catch (error) {
    console.error('Error handling /start:', error);
    bot.sendMessage(chatId, '❌ Error: Could not process command');
  }
});

// Handle /roast command
bot.onText(/\/roast/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  console.log(`📨 /roast command from user ${userId}`);
  
  try {
    await handlers.handleRoastCommand(bot, chatId, userId);
  } catch (error) {
    console.error('Error handling /roast:', error);
    bot.sendMessage(chatId, '❌ Error: Could not process command');
  }
});

// Handle /help command
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  console.log(`📨 /help command from user ${msg.from.id}`);
  
  try {
    await handlers.handleHelpCommand(bot, chatId);
  } catch (error) {
    console.error('Error handling /help:', error);
    bot.sendMessage(chatId, '❌ Error: Could not process command');
  }
});

// Handle /analysis command
bot.onText(/\/analysis/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  console.log(`📨 /analysis command from user ${userId}`);
  
  try {
    await handlers.handleAnalysisCommand(bot, chatId, userId);
  } catch (error) {
    console.error('Error handling /analysis:', error);
    bot.sendMessage(chatId, '❌ Error: Could not process command');
  }
});

// Handle regular text messages
bot.on('message', async (msg) => {
  // Skip if it's a command
  if (msg.text?.startsWith('/')) return;

  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  console.log(`💬 Message from user ${userId}: ${text}`);

  try {
    await handlers.handleUserInput(bot, chatId, userId, text);
  } catch (error) {
    console.error('Error handling message:', error);
    bot.sendMessage(chatId, '❌ Error: Could not process your message');
  }
});

// Error handler
bot.on('error', (error) => {
  console.error('🚨 Bot error:', error.message);
});

bot.on('polling_error', (error) => {
  console.error('🚨 Polling error:', error.message);
});

// ========== WEBHOOK SETUP ==========
if (useWebhook) {
  console.log('🌐 Setting up webhook mode...');
  
  // Create Express app for webhook
  const app = express();
  app.use(express.json());
  
  // Health check endpoint
  app.get('/', (req, res) => {
    res.send('✅ League Roaster Bot is running!');
  });
  
  // Webhook endpoint
  const webhookPath = `/bot${TOKEN}`;
  app.post(webhookPath, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
  
  // Set webhook with Telegram
  (async () => {
    try {
      const webhookUrl = `${WEBHOOK_URL}${webhookPath}`;
      await bot.setWebHook(webhookUrl);
      console.log(`✅ Webhook set to: ${webhookUrl}`);
    } catch (error) {
      console.error('❌ Failed to set webhook:', error.message);
    }
  })();
  
  // Start HTTP server
  app.listen(PORT, () => {
    console.log(`🚀 Webhook server listening on port ${PORT}`);
  });
} else {
  console.log('📡 Using polling mode (local development)');
}

console.log('✅ Bot is running and waiting for messages...');
