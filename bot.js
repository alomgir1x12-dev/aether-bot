const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();

/* =========================================
   BOT TOKEN
   ========================================= */

// এখানে নিজের নতুন BotFather token বসাবে।
const TOKEN = '8816789390:AAHRnDzJ_zqEXv9AyCiTK7NMhM9HSNAmDmY';

/* =========================================
   FIREBASE REALTIME DATABASE
   ========================================= */

const FIREBASE_DB =
  'https://aether-13aed-default-rtdb.firebaseio.com';

const BOT_USERNAME = 'AetherMineAppBot';
const APP_SHORT_NAME = 'aether';

const APP_URL =
  `https://t.me/${BOT_USERNAME}/${APP_SHORT_NAME}`;

const lastMessages = new Map();

/* =========================================
   EXPRESS SERVER
   ========================================= */

app.get('/', (req, res) => {
  res.status(200).send('AETHER MINE Bot is Online 🚀');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('AETHER MINE Web Server Started');
});

/* =========================================
   FIREBASE REST HELPERS
   ========================================= */

async function firebaseRequest(path, method = 'GET', data) {
  const url =
    `${FIREBASE_DB}/${path}.json`;

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (data !== undefined) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      `Firebase HTTP ${response.status}: ${
        JSON.stringify(result)
      }`
    );
  }

  return result;
}

async function getUser(userKey) {
  return firebaseRequest(
    `aethermine_users/${userKey}`
  );
}

async function createUserIfMissing(msg) {
  const telegramId = String(msg.from.id);
  const userKey = `ae_${telegramId}`;

  const existingUser = await getUser(userKey);

  // পুরোনো ইউজারের ব্যালেন্স বা প্রগ্রেস পরিবর্তন করবে না।
  if (existingUser) {
    return existingUser;
  }

  const firstName = msg.from.first_name || 'Commander';
  const lastName = msg.from.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();

  const newUser = {
    id: userKey,
    chatId: telegramId,
    tgId: telegramId,
    name: fullName,
    username: msg.from.username || '',
    photo: '',

    referralCode: telegramId,
    referredBy: null,
    referredByChatId: null,
    referralRewarded: false,

    credits: 0,
    usdt: 0,
    plasma: 0,
    darkMatter: 0,

    referrals: {},
    referralsCount: 0,
    referralsCompleted: 0,

    stations: {},
    research: {
      alpha_unlock: 1
    },
    crew: {},
    crewHired: {},

    history: [],
    withdrawHistory: [],

    energy: 20,
    heat: 0,

    banned: false,
    createdAt: Date.now()
  };

  // শুধু নতুন ইউজারের রেকর্ড তৈরি করবে।
  await firebaseRequest(
    `aethermine_users/${userKey}`,
    'PUT',
    newUser
  );

  return newUser;
}

/* =========================================
   TELEGRAM BOT
   ========================================= */

const bot = new TelegramBot(TOKEN, {
  polling: false
});

bot.on('polling_error', (err) => {
  console.error('Telegram Polling Error:', err.message);
});

(async () => {
  try {
    await bot.deleteWebHook({
      drop_pending_updates: false
    });

    await bot.startPolling();

    console.log('AETHER MINE Bot Started');
  } catch (error) {
    console.error('Bot Startup Error:', error.message);
  }
})();

/* =========================================
   HTML ESCAPE
   ========================================= */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* =========================================
   START COMMAND + REFERRAL
   ========================================= */

bot.onText(/^\/start(?:@\w+)?(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const telegramId = String(msg.from.id);

  const firstName = msg.from.first_name || 'Commander';

  const rawPayload = (match?.[1] || '').trim();

  let referrerId = null;

  // Accept /start ref_123456 and /start 123456
  if (rawPayload.startsWith('ref_')) {
    const candidate = rawPayload.slice(4);

    if (/^\d+$/.test(candidate) && candidate !== telegramId) {
      referrerId = candidate;
    }
  } else if (
    /^\d+$/.test(rawPayload) &&
    rawPayload !== telegramId
  ) {
    referrerId = rawPayload;
  }

  try {
    // Create Firebase user if missing.
    // Existing balances and progress remain untouched.
    await createUserIfMissing(msg);

    // Forward the referral ID to the Mini App.
    // The app's own handleDeepLink/applyReferral
    // functions process and register the referral.
    const makeAppUrl = (page) => {
      const startParam = referrerId
        ? `ref_${referrerId}`
        : page;

      return `${APP_URL}?startapp=${encodeURIComponent(startParam)}`;
    };

    const welcomeText = `
🚀 <b>WELCOME TO AETHER MINE!</b>

Hello, ${escapeHtml(firstName)}! 👨‍🚀

Your orbital mining journey starts here. 🛰️

💎 <b>Deploy Stations &amp; Mine Resources</b>
📈 Collect USDT, Plasma &amp; Dark Matter
👨‍🚀 Hire Crew &amp; Unlock Tech Upgrades
⚡ Watch Ads &amp; Complete Tasks for Energy
🔄 Refine Resources in the Vault
💸 Manage Your Balance &amp; Withdraw

🌌 Explore the universe and build your mining empire!

⛏️ <b>Start Mining • Explore Space • Grow Your Balance</b>
`;

    const sent = await bot.sendMessage(
      chatId,
      welcomeText,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '⛏️ OPEN MINING',
                url: makeAppUrl('mine')
              }
            ],
            [
              {
                text: '⚡ GET ENERGY',
                url: makeAppUrl('energy')
              },
              {
                text: '💸 MY BALANCE',
                url: makeAppUrl('balance')
              }
            ],
            [
              {
                text: '🎁 REFERRAL',
                url: makeAppUrl('profile')
              },
              {
                text: '👷 TASKS',
                url: makeAppUrl('crew')
              }
            ],
            [
              {
                text: '📢 PAYMENT CHANNEL',
                url: 'https://t.me/AETHER_MINE_PAY'
              }
            ]
          ]
        }
      }
    );

    lastMessages.set(telegramId, sent.message_id);

    console.log(
      `START successful: ${telegramId}` +
      (referrerId ? ` | Referral: ${referrerId}` : '')
    );

  } catch (error) {
    console.error('START HANDLER ERROR:', error.message);

    await bot.sendMessage(
      chatId,
      'Welcome to AETHER MINE! 🚀\n\n' +
      'The service is temporarily unavailable. Please try again shortly.'
    ).catch(() => {});
  }
});
