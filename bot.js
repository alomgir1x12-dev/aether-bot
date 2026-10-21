const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');

// ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyBsJLl9PikTW8JGUjMvGWDF0QCqiEuF-Ms",
  authDomain: "aether-13aed.firebaseapp.com",
  databaseURL: "https://aether-13aed-default-rtdb.firebaseio.com",
  projectId: "aether-13aed",
  storageBucket: "aether-13aed.firebasestorage.app",
  messagingSenderId: "946559870177",
  appId: "1:946559870177:web:22eaeaa6999e955327c3a0"
};

// ফায়ারবেস ইনিশিয়ালাইজ
const fbApp = initializeApp(firebaseConfig);
const db = getDatabase(fbApp);

const BOT_USERNAME = 'AetherMineAppBot';
const userData = new Map();

// Web Server (Render এ সচল রাখার জন্য)
const app = express();
app.get('/', (req, res) => res.send('AETHER MINE Bot is Online'));
app.listen(process.env.PORT || 3000, () => console.log("Web Server Live"));

// Render কে ঘুমাতে না দেওয়ার জন্য পিং
setInterval(() => {
  if (process.env.RENDER_EXTERNAL_HOSTNAME) {
    fetch(`https://${process.env.RENDER_EXTERNAL_HOSTNAME}`).catch(() => {});
  }
}, 4 * 60 * 1000);

// মেইন বট লঞ্চ ফাংশন
async function startBot() {
  try {
    console.log("⏳ Fetching Bot Token from Firebase...");
    
    // ফায়ারবেস থেকে টোকেন রিড করা
    const tokenRef = ref(db, 'aethermine_settings/botToken');
    const snapshot = await get(tokenRef);

    if (!snapshot.exists()) {
      console.error("❌ ERROR: Bot Token is not set in Firebase! Please set it using bot-admin.html");
      return;
    }

    const TOKEN = snapshot.val();
    console.log("✅ Token Fetched Successfully! Starting Bot...");

    // বট ইনিশিয়ালাইজ
    const bot = new TelegramBot(TOKEN, { polling: false });

    await bot.deleteWebHook({ drop_pending_updates: true });
    await bot.startPolling();
    console.log("🚀 Bot Started Successfully");

    bot.on('polling_error', (e) => console.log("Polling Error:", e.message));

    // Start Command
    bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const userId = String(msg.from.id);
      const name = msg.from.first_name || "User";

      let data = userData.get(userId);
      if (!data) {
        data = { startIds: [], welcomeId: null };
        userData.set(userId, data);
      }

      try {
        if (data.welcomeId) {
          try { await bot.deleteMessage(chatId, data.welcomeId); } catch (e) {}
        }

        data.startIds.push(msg.message_id);
        if (data.startIds.length > 2) {
          const oldest = data.startIds.shift();
          try { await bot.deleteMessage(chatId, oldest); } catch (e) {}
        }

        const welcomeText = `🚀 Welcome to AETHER MINE!
Your orbital mining journey starts here.
🛰️

Hello, ${name}!

💎 Deploy Stations & Mine Resources
📈 Collect USDT, Plasma & Dark Matter
👷 Hire Crew & Unlock Tech Upgrades
📺 Watch Ads & Complete Tasks for Energy
🔄 Refine & Exchange Resources in Vault
💸 Convert to Credits & Withdraw Crypto

🔧 The platform is under continuous development, with more features coming soon.

⛏️ Start Mining • Explore Space • Grow Your Balance`;

        const sent = await bot.sendMessage(chatId, welcomeText, {
          reply_markup: {
            inline_keyboard: [
              [{ text: "⛏️ Open Mining", url: `https://t.me/${BOT_USERNAME}/aether?startapp=mine` }],
              [
                { text: "⚡ Get Energy", url: `https://t.me/${BOT_USERNAME}/aether?startapp=energy` },
                { text: "💸 Withdraw", url: `https://t.me/${BOT_USERNAME}/aether?startapp=balance` }
              ],
              [
                { text: "🎁 Referral", url: `https://t.me/${BOT_USERNAME}/aether?startapp=profile` },
                { text: "👷 TASK", url: `https://t.me/${BOT_USERNAME}/aether?startapp=crew` }
              ],
              [{ text: "JOIN PAY CHANNEL", url: "https://t.me/AETHER_MINE_PAY" }]
            ]
          }
        });

        data.welcomeId = sent.message_id;
        userData.set(userId, data);
      } catch (err) {
        console.log("Message Error:", err.message);
      }
    });

  } catch (error) {
    console.error("❌ Failed to start bot:", error.message);
  }
}

// বট চালু করা
startBot();
