const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.BOT_TOKEN || '8816789390:AAF6DpXnhL9LdUU5FX5hk0IABZ1qYwmhcic';

// এই Map টা মনে রাখবে কার শেষ মেসেজ কোনটা
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
  await bot.deleteWebHook({ drop_pending_updates: true });
  await bot.startPolling();
  console.log("AETHER MINE Bot Started - Clean & Single Message Mode!");
})();

bot.on('polling_error', (err) => console.log(err.code));

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // 1. ইউজার যে /start লিখছে সেটা ডিলিট
  try { await bot.deleteMessage(chatId, msg.message_id); } catch(e){}

  // 2. আগের বটের মেসেজ থাকলে সেটা ডিলিট
  if (lastMessages.has(userId)) {
    const oldMsgId = lastMessages.get(userId);
    try { await bot.deleteMessage(chatId, oldMsgId); } catch(e){}
  }

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

  try {
    const sent = await bot.sendMessage(chatId, welcomeText, {
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
    // নতুন মেসেজের ID সেভ করে রাখলাম পরেরবার ডিলিট করার জন্য
    lastMessages.set(userId, sent.message_id);
  } catch(e) { console.log(e) }
});
