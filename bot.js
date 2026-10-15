const TOKEN = "8816789390:AAGnNfAmNkrChoDJf2U3T-0IiCtBeVf9yd8";
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(TOKEN, { polling: true });

console.log("🛰️ AETHER MINE Bot 24/7 Started!");

const TEXT = `🛰️ Welcome to AETHER MINE, Commander!
You've been assigned command of an orbital mining station.

💎 RESOURCES: USDT | Plasma | Dark Matter
⚡ ALPHA·BETA·GAMMA rings | Hire crew | Tech upgrades
💸 Real Withdraw: bKash, Nagad, TON, USDT

▶️ Tap below to start mining!`;

const KEYBOARD = {
  inline_keyboard: [
    [{ text: "⛏️ OPEN MINE", url: "https://t.me/AetherMineAppBot/aether" }],
    [{ text: "JOIN PAY CHANNEL", url: "https://t.me/AETHER_MINE_PAY" }],
    [{ text: "AETHER SUPPORT", url: "https://t.me/Aether_mine_support" }]
  ]
};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, TEXT, {
    reply_markup: KEYBOARD
  });
  console.log(`✅ Sent to ${msg.from.username || msg.chat.id}`);
});

bot.on('polling_error', (err) => console.log(err));
