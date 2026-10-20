const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.BOT_TOKEN || '8816789390:AAH2vV85PQRBHTxHTfsZdCSho6HubyQDXTE;
const lastMessages = new Map();

const app = express();
app.get('/', (req, res) => res.send('AETHER MINE Bot is Online'));
app.listen(process.env.PORT || 3000, () => console.log("Web Server Live"));

setInterval(() => {
  if(process.env.RENDER_EXTERNAL_HOSTNAME){
    fetch(`https://${process.env.RENDER_EXTERNAL_HOSTNAME}`).catch(()=>{});
  }
}, 4 * 60 * 1000);

const bot = new TelegramBot(TOKEN, { polling: false });
(async () => {
  try {
    await bot.deleteWebHook({ drop_pending_updates: true });
    await bot.startPolling();
    console.log("Bot Started With New Token - Fixed!");
  } catch(e){ console.log(e) }
})();
bot.on('polling_error', (e) => console.log(e.message));

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try { await bot.deleteMessage(chatId, msg.message_id); } catch(e){}
  if (lastMessages.has(userId)) {
    try { await bot.deleteMessage(chatId, lastMessages.get(userId)); } catch(e){}
  }

  const welcomeText = `🚀 <b>Welcome to AETHER MINE!</b>
Your orbital mining journey starts here. 🛰️

💎 Deploy Stations & Mine Resources
📈 Collect USDT, Plasma & Dark Matter
👨‍🚀 Hire Crew & Unlock Tech Upgrades
📺 Watch Ads & Complete Tasks for Energy
🔄 Refine & Exchange Resources in Vault
💸 Convert to Credits & Withdraw Crypto

🔧 The platform is under continuous development, with more features coming soon.

⛏️ Start Mining • Explore Space • Grow Your Balance`;

  const sent = await bot.sendMessage(chatId, welcomeText, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "⛏️ Open Mining", url: "https://t.me/AetherMineAppBot/aether?startapp=mine" }],
        [
          { text: "⚡ Get Energy", url: "https://t.me/AetherMineAppBot/aether?startapp=energy" },
          { text: "💸 Withdraw", url: "https://t.me/AetherMineAppBot/aether?startapp=balance" }
        ],
        [
          { text: "🎁 Referral", url: "https://t.me/AetherMineAppBot/aether?startapp=profile" },
          { text: "👷 TASK", url: "https://t.me/AetherMineAppBot/aether?startapp=crew" }
        ],
        [{ text: "JOIN PAY CHANNEL", url: "https://t.me/AETHER_MINE_PAY" }]
      ]
    }
  });
  lastMessages.set(userId, sent.message_id);
});
