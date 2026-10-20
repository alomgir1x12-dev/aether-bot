const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();

const TOKEN = '8816789390:AAEF3StUlGZRwSwWdxGutCu9VumwBbwtPBk';
const FIREBASE_DB = 'https://aether-13aed-default-rtdb.firebaseio.com';
const BOT_USERNAME = 'AetherMineAppBot';
const APP_SHORT_NAME = 'aether';
const APP_URL = `https://t.me/${BOT_USERNAME}/${APP_SHORT_NAME}`;

// 1টা Welcome + 2টা /start রাখার জন্য
const lastMessages = new Map();
const userStartIds = new Map(); // userId -> [msgId1, msgId2]

app.get('/', (req, res) => res.send('AETHER MINE Bot is Online 🚀'));
app.listen(process.env.PORT || 3000, () => console.log("Web Server Live"));

// Anti-sleep - ১ম কোড থেকে
setInterval(() => {
  if(process.env.RENDER_EXTERNAL_HOSTNAME){
    fetch(`https://${process.env.RENDER_EXTERNAL_HOSTNAME}`).catch(()=>{});
  }
}, 4 * 60 * 1000);

async function firebaseRequest(path, method = 'GET', data) {
  const url = `${FIREBASE_DB}/${path}.json`;
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (data !== undefined) options.body = JSON.stringify(data);
  const r = await fetch(url, options);
  const j = await r.json().catch(()=>null);
  if(!r.ok) throw new Error(`Firebase ${r.status}`);
  return j;
}
async function getUser(k){ return firebaseRequest(`aethermine_users/${k}`); }
async function createUserIfMissing(msg){
  const tid = String(msg.from.id);
  const key = `ae_${tid}`;
  const old = await getUser(key);
  if(old) return old;
  const fn = msg.from.first_name || 'Commander';
  const ln = msg.from.last_name || '';
  const name = `${fn} ${ln}`.trim();
  const nu = { id: key, chatId: tid, tgId: tid, name, username: msg.from.username||'', credits:0, usdt:0, plasma:0, darkMatter:0, referrals:{}, energy:20, createdAt: Date.now() };
  await firebaseRequest(`aethermine_users/${key}`, 'PUT', nu);
  return nu;
}

const bot = new TelegramBot(TOKEN, { polling: false });
(async () => {
  await bot.deleteWebHook({ drop_pending_updates: false });
  await bot.startPolling();
  console.log("AETHER MINE Bot Started - Fixed Delete Logic!");
})();
bot.on('polling_error', (e) => console.log(e.message));

function escapeHtml(v){ return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

bot.onText(/^\/start(?:@\w+)?(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const telegramId = String(msg.from.id);
  const firstName = msg.from.first_name || 'Commander';
  const rawPayload = (match?.[1] || '').trim();
  let referrerId = null;
  if (rawPayload.startsWith('ref_')) {
    const c = rawPayload.slice(4);
    if (/^\d+$/.test(c) && c !== telegramId) referrerId = c;
  } else if (/^\d+$/.test(rawPayload) && rawPayload !== telegramId) {
    referrerId = rawPayload;
  }

  try {
    // ========== DELETE LOGIC - তোমার চাওয়া মতো ==========
    // 1. Welcome মেসেজ - আগেরটা ডিলিট, নতুন 1টাই থাকবে
    const oldBotId = lastMessages.get(telegramId);
    if (oldBotId) {
      try { await bot.deleteMessage(chatId, oldBotId); } catch(e){}
    }

    // 2. /start মেসেজ - 2টার বেশি জমলে 1টা ডিলিট
    let startList = userStartIds.get(telegramId) || [];
    if (startList.length >= 2) {
      const toDel = startList.shift(); // সবচেয়ে পুরনো /start
      try { await bot.deleteMessage(chatId, toDel); } catch(e){}
    }
    startList.push(msg.message_id);
    userStartIds.set(telegramId, startList);
    // ========== DELETE LOGIC END ==========

    await createUserIfMissing(msg);

    // Referral Count Logic - আগের মতোই
    if (referrerId && referrerId != telegramId) {
      try {
        const already = await firebaseRequest(`bot_properties/referred_${telegramId}`);
        if (!already) {
          await firebaseRequest(`bot_properties/referred_${telegramId}`, 'PUT', referrerId);
          await firebaseRequest(`bot_properties/ref_status_${telegramId}`, 'PUT', "pending");
          let rName = msg.from.first_name || "User";
          if(msg.from.last_name) rName += " " + msg.from.last_name;
          await firebaseRequest(`bot_properties/ref_name_${telegramId}`, 'PUT', rName);
          let list = await firebaseRequest(`bot_properties/ref_list_${referrerId}`) || [];
          if (Array.isArray(list) && list.indexOf(telegramId)===-1) {
            list.push(telegramId);
            await firebaseRequest(`bot_properties/ref_list_${referrerId}`, 'PUT', list);
          }
          try { await bot.sendMessage(referrerId, `👤 New Join: ${rName}\n⏳ Pending - 30 RMF earn করলে 100 RMF পাবে`); } catch(e){}
        }
      } catch(e){}
    }

    const makeAppUrl = (page) => {
      const startParam = referrerId ? `ref_${referrerId}` : page;
      return `${APP_URL}?startapp=${encodeURIComponent(startParam)}`;
    };

    // Welcome Text - ছোট কোডের মতো সাজানো + Hello User
    const welcomeText = `🚀 <b>Welcome to AETHER MINE!</b>

Hello, ${escapeHtml(firstName)}! 👨‍🚀

Your orbital mining journey starts here.

🛰️ 💎 <b>Deploy Stations & Mine Resources</b>
📈 Collect USDT, Plasma & Dark Matter
👨‍🚀 Hire Crew & Unlock Tech Upgrades
📺 Watch Ads & Complete Tasks for Energy
🔄 Refine & Exchange Resources in Vault
💸 Convert to Credits & Withdraw Crypto

🔧 The platform is under continuous development, with more features coming soon.

⛏️ <b>Start Mining • Explore Space • Grow Your Balance</b>`;

    const sent = await bot.sendMessage(chatId, welcomeText, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "⛏️ Open Mining", url: makeAppUrl('mine') }],
          [{ text: "⚡ Get Energy", url: makeAppUrl('energy') }, { text: "💸 Withdraw", url: makeAppUrl('balance') }],
          [{ text: "🎁 Referral", url: makeAppUrl('profile') }, { text: "👷 TASK", url: makeAppUrl('crew') }],
          [{ text: "JOIN PAY CHANNEL", url: "https://t.me/AETHER_MINE_PAY" }]
        ]
      }
    });

    lastMessages.set(telegramId, sent.message_id);
  } catch (err) {
    console.error(err.message);
  }
});
