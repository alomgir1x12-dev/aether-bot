const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '8816789390:AAGnNfAmNkrChoDJf2U3T-0IiCtBeVf9yd8';
const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
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
💳 Payment Channel: 👉 @AetherMinePay
🆘 Support Center: 👉 @AetherMineSupport

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
        [{ text: "OPEN MINE ⛏️", url: "https://t.me/AetherMineAppBot/aether" }],
        [{ text: "JOIN PAY CHANNEL", url: "https://t.me/AETHER_MINE_PAY" }],
        [{ text: "AETHER SUPPORT", url: "https://t.me/Aether_mine_support" }]
      ]
    }
  });
});

console.log("AETHER MINE Bot Started!");
