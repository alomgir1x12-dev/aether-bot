const express = require('express'); 
const TelegramBot = require('node-telegram-bot-api'); 

const TOKEN = process.env.BOT_TOKEN || '8816789390:AAGZRj0F5lC1tePe2XD2eDgFBLoT-OU6aJk; 

// userId -> { startIds: [], welcomeId: null }
const userData = new Map(); 

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
  const userId = String(msg.from.id); 

  let data = userData.get(userId);
  if (!data) {
    data = { startIds: [], welcomeId: null };
    userData.set(userId, data);
  }

  try { 
    // 1. Welcome মেসেজ ডিলিট - আগেরটা থাকলে ডিলিট হবে
    if (data.welcomeId) {
      try { await bot.deleteMessage(chatId, data.welcomeId); } catch(e){}
    }

    // 2. /start লজিক - 2টা জমলে 1টা ডিলিট
    data.startIds.push(msg.message_id);
    if (data.startIds.length > 2) {
      const oldestStart = data.startIds.shift(); // সবচেয়ে পুরনো /start
      try { await bot.deleteMessage(chatId, oldestStart); } catch(e){}
    }

    const welcomeText = `🚀 <b>Welcome to AETHER MINE!</b> Your orbital mining journey starts here. 🛰️ 💎 Deploy Stations & Mine Resources 📈 Collect USDT, Plasma & Dark Matter 👨‍🚀 Hire Crew & Unlock Tech Upgrades 📺 Watch Ads & Complete Tasks for Energy 🔄 Refine & Exchange Resources in Vault 💸 Convert to Credits & Withdraw Crypto 🔧 The platform is under continuous development, with more features coming soon. ⛏️ Start Mining • Explore Space • Grow Your Balance`; 

    const sent = await bot.sendMessage(chatId, welcomeText, { 
      parse_mode: "HTML", 
      reply_markup: { 
        inline_keyboard: [ 
          [{ text: "⛏️ Open Mining", url: "https://t.me/AetherMineAppBot/aether?startapp=mine" }], 
          [ { text: "⚡ Get Energy", url: "https://t.me/AetherMineAppBot/aether?startapp=energy" }, { text: "💸 Withdraw", url: "https://t.me/AetherMineAppBot/aether?startapp=balance" } ], 
          [ { text: "🎁 Referral", url: "https://t.me/AetherMineAppBot/aether?startapp=profile" }, { text: "👷 TASK", url: "https://t.me/AetherMineAppBot/aether?startapp=crew" } ], 
          [{ text: "JOIN PAY CHANNEL", url: "https://t.me/AETHER_MINE_PAY" }] 
        ] 
      } 
    }); 

    data.welcomeId = sent.message_id;
    userData.set(userId, data);

  } catch(err) { 
    console.error(err.message); 
  } 
});
