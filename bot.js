const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.BOT_TOKEN || '8816789390:AAF6DpXnhL9LdUU5FX5hk0IABZ1qYwmhcic';

const app = express();
app.get('/', (req, res) => res.send('AETHER MINE Bot is Online'));
app.listen(process.env.PORT || 3000, () => console.log("Web Server Live"));

// বট চালু করার আগে Webhook ডিলিট করে নেবে, তাহলে আর Conflict হবে না
const bot = new TelegramBot(TOKEN, { polling: false });

(async () => {
  try {
    await bot.deleteWebHook({ drop_pending_updates: true });
    await bot.startPolling();
    console.log("AETHER MINE Bot Started - Polling Fixed & 24/7!");
  } catch(e) { console.log(e) }
})();

setInterval(() => {
  if(process.env.RENDER_EXTERNAL_HOSTNAME){
    fetch(`https://${process.env.RENDER_EXTERNAL_HOSTNAME}`).catch(()=>{});
  }
}, 4 * 60 * 1000);

bot.on('polling_error', (err) => {
  console.log("Polling error, retrying...", err.code);
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeText = `🚀 <b>Welcome to AETHER MINE!</b>
Your orbital mining journey starts here. ⛏️

💎 Deploy Stations & Mine Resources
📈 Collect USDT, Plasma & Dark Matter
👨‍🚀 Hire Crew & Unlock Tech Upgrades
📺 Watch Ads & Complete Tasks for Energy
🔄 Refine & Exchange Resources in Vault
💸 Convert to Credits & Withdraw Crypto

🔧 The platform is under continuous development, with more features coming soon.

⛏️ Start Mining • Explore Space • Grow Your Balance`;

  bot.sendMessage(chatId, welcomeText, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "⛏️ Open Mining", web_app: { url: "https://t.me/AetherMineAppBot/aether?startapp=mine" } }],
        [
          { text: "⚡ Get Energy", web_app: { url: "https://t.me/AetherMineAppBot/aether?startapp=energy" } },
          { text: "💸 Withdraw", web_app: { url: "https://t.me/AetherMineAppBot/aether?startapp=balance" } }
        ],
        [
          { text: "🎁 Referral", web_app: { url: "https://t.me/AetherMineAppBot/aether?startapp=profile" } },
          { text: "👷 TASK", web_app: { url: "https://t.me/AetherMineAppBot/aether?startapp=crew" } }
        ],
        [{ text: "JOIN PAY CHANNEL", url: "https://t.me/AETHER_MINE_PAY" }]
      ]
    }
  });
});
