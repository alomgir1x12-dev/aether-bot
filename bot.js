const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '8816789390:AAGnNfAmNkrChoDJf2U3T-0IiCtBeVf9yd8';
const bot = new TelegramBot(TOKEN, { polling: true });

console.log("AETHER MINE Bot Started!");

const TEXT = `💎 *AETHER MINE* 💎

*THE REAL EARNING GAME STARTED...*
Mining + Watching Videos Earn Daily $

🚀 *How to Start:*
1. Click Open Mine & Start Mining
2. Complete Tasks & Earn AETHER
3. Withdraw USDT

🔥 *Don't miss the biggest mining!*`;

const KEYBOARD = {
  inline_keyboard: [
    [{ text: "OPEN MINE ⛏️", url: "https://t.me/AetherMineAppBot/aether" }],
    [{ text: "JOIN PAY CHANNEL", url: "https://t.me/AETHER_MINE_PAY" }],
    [{ text: "AETHER SUPPORT", url: "https://t.me/Aether_mine_support" }]
  ]
};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, TEXT, {
    parse_mode: "Markdown",
    reply_markup: KEYBOARD
  });
});

bot.on('message', (msg) => {
  if (msg.text !== '/start') {
    bot.sendMessage(msg.chat.id, TEXT, {
      parse_mode: "Markdown",
      reply_markup: KEYBOARD
    });
  }
});
