const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

// Render এর Environment Variable থেকে টোকেন নেবে - হার্ডকোড করো না
const TOKEN = process.env.BOT_TOKEN || '8816789390:AAEdpaDDbDJBweyzDC9Yj9aV5xVfLODBb34';
const bot = new TelegramBot(TOKEN, { polling: true });

// 24/7 অনলাইন থাকার জন্য ওয়েব সার্ভার
const app = express();
app.get('/', (req, res) => res.send('AETHER MINE Bot is Online'));
app.listen(process.env.PORT || 3000, () => console.log("Web Server Live"));

// 4 মিনিট পর পর নিজে নিজেকে পিং - যাতে ঘুমিয়ে না যায়
setInterval(() => {
  if(process.env.RENDER_EXTERNAL_HOSTNAME){
    fetch(`https://${process.env.RENDER_EXTERNAL_HOSTNAME}`).catch(()=>{});
  }
}, 4 * 60 * 1000);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  // রেফার লিংক - ইউজার আনবে
  const refLink = `https://t.me/AetherMineAppBot/aether?startapp=${msg.from.id}`;

  const text = `🛰️ ═══ AETHER MINE ═══ 🛰️
Hello, Commander! 👨‍🚀
Welcome aboard the orbital mining station.

🌌 Mine crypto from space. Collect real rewards. Withdraw to your wallet. All inside Telegram!

━━━━━━━━━━━━━━━━━━━━━━━
💎 MINE 3 PRECIOUS RESOURCES
━━━━━━━━━━━━━━━━━━━━━━━
💰 USDT ........... ∞ Unlimited stations
🔥 PLASMA ......... Max 2 stations
💠 DARK MATTER .... Max 2 stations

━━━━━━━━━━━━━━━━━━━━━━━
⚡ STATION FEATURES
━━━━━━━━━━━━━━━━━━━━━━━
🔵 3 Orbital Rings → ALPHA · BETA · GAMMA
👥 Hire Elite Crew → +5% to +12% bonus yield
🔬 Research Tech → Unlock powerful upgrades
🔄 Refinery → Fuse resources for higher value
⚡ Energy System → Watch ads to refill

━━━━━━━━━━━━━━━━━━━━━━━
💸 WITHDRAWAL INFO
━━━━━━━━━━━━━━━━━━━━━━━
💱 Rate: 20,000 CR = $1 USD
📊 Minimum: 5,000 Credits (= $0.25)
⏱️ Processing: Within 24 hours
💳 Methods: bKash · Nagad · TON · USDT (TRC20)

━━━━━━━━━━━━━━━━━━━━━━━
📢 OFFICIAL CHANNELS
━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━
🎁 BONUS FOR YOU
━━━━━━━━━━━━━━━━━━━━━━━
🎉 Start with 20 FREE Energy
🎁 Invite friends → +200 Credits each
⚡ Watch ads → +20 Energy free


━━━━━━━━━━━━━━━━━━━━━━━
▶️ Tap the button below to launch your station and start earning!
🌌 Mine the stars. Own the Aether.`;

  bot.sendMessage(chatId, text, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "OPEN MINE ⛏️", url: refLink }],
        [{ text: "JOIN PAY CHANNEL", url: "https://t.me/AETHER_MINE_PAY" }],
        [{ text: "AETHER SUPPORT", url: "https://t.me/Aether_mine_support" }]
      ]
    }
  });
});

console.log("AETHER MINE Bot Started - Clean & 24/7!");
