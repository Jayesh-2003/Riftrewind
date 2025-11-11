# 🤖 League Roaster Bot - JavaScript Edition

A powerful Telegram bot that roasts League of Legends players on their gaming names and match performance using the free Groq AI API.

## ✨ Features

- 🎮 **Register your League account** with `/start` command
- 🔥 **Get roasted on your name** - Groq AI generates witty roasts
- 📊 **Get roasted on match performance** - Detailed stats-based roasting with `/roast`
- 💾 **Persistent storage** - Saves your account info in MongoDB
- 🚀 **Easy deployment** - Free hosting options available
- ⚡ **Fast** - Uses Groq's free tier for instant AI responses

## 🎯 Bot Commands

- `/start` - Register your League account (GameName#TagLine format)
- `/roast` - Get roasted on your latest League match
- `/help` - Show help information

## 📋 Prerequisites

You'll need to set up these free accounts:

1. **Telegram Bot Token**
   - Message [@BotFather](https://t.me/BotFather) on Telegram
   - Create a new bot and copy the token

2. **Groq API Key** (Free tier available!)
   - Sign up at [console.groq.com](https://console.groq.com)
   - Create an API key (free tier: 30 requests/minute)

3. **Riot API Key** (Free tier available!)
   - Sign up at [developer.riotgames.com](https://developer.riotgames.com)
   - Create a new API key (rate limited but free)

4. **MongoDB** (Free tier available!)
   - Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster and get connection string

5. **Node.js**
   - Download from [nodejs.org](https://nodejs.org) (v18+)

## 🚀 Quick Start

### Local Development

```bash
# 1. Clone or download this project
cd RiftWind

# 2. Install dependencies
npm install

# 3. Create .env file from example
cp .env.example .env

# 4. Edit .env with your API keys
# Add your TELEGRAM_BOT_TOKEN, GROQ_API_KEY, RIOT_API_KEY, MONGODB_URI

# 5. Run the bot
npm start

# For development with auto-reload:
npm run dev
```

## 📦 Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
GROQ_API_KEY=your_groq_key_here
RIOT_API_KEY=your_riot_key_here
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
```


## 🏗️ Project Structure

```
RiftWind/
├── bot.js              # Main bot entry point
├── handlers.js         # Command handlers
├── api.js              # Riot API integration
├── ai.js               # Groq AI integration
├── db.js               # MongoDB operations
├── package.json        # Dependencies
├── .env.example        # Environment template
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## 🔄 How It Works

### /start Flow
1. User sends `/start` command
2. Bot asks for GameName#TagLine
3. Bot calls Riot API to verify account and get PUUID
4. Groq AI roasts their gaming name
5. Account saved to MongoDB
6. User can now use `/roast`

### /roast Flow
1. User sends `/roast` command
2. Bot retrieves user data from MongoDB
3. Fetches their latest League match via Riot API
4. Extracts match statistics
5. Groq AI generates detailed match roast
6. Displays roast with stats breakdown


## 💡 Tips & Tricks

- The bot stores your account info, so you only need to `/start` once
- Use `/roast` after each match to see new roasts!
- The more interesting your stats, the better the roasts!
- Share your bot with friends (they need their own Telegram user ID though)

## 📄 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

Feel free to fork and submit pull requests!

## 💬 Support

If you have issues:
1. Check the troubleshooting section
2. Verify all API keys are correct
3. Check that MongoDB is connected
4. Look at console logs for error details

---

**Happy Roasting!** 🔥 May your enemies' stats be terrible! 😈
