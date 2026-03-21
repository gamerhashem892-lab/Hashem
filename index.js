const mineflayer = require('mineflayer');
const express = require('express');

// إعدادات السيرفر حقك
const SERVER_HOST = "Modcraft-gYuZ.aternos.me";
const SERVER_PORT = 43889;
const VERSION = "1.21.1";

// مصفوفة البوتات بأسماء جديدة تماماً
const BOT_INFOS = [
    { username: "Hashem_Super_1", joinDelay: 5000 },
    { username: "Hashem_Super_2", joinDelay: 35000 },
];

function createBot({ username }) {
    console.log(`📡 [${username}] جاري محاولة الدخول الآن...`);
    
    const bot = mineflayer.createBot({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: username,
        version: VERSION,
    });

    bot.on('spawn', () => {
        console.log(`✅ كفووو! [${username}] دخل السيرفر بنجاح.`);
        bot.chat("Hashem's Bot is here! 🛡️");
    });

    bot.on('error', (err) => console.log(`❌ [${username}] خطأ: ${err.message}`));
    
    bot.on('end', () => {
        console.log(`⚠️ [${username}] فصل.. بحاول أرجع بعد 30 ثانية`);
        setTimeout(() => createBot({ username }), 30000);
    });
}

// تشغيل السيرفر عشان Render ما يطفي
const app = express();
app.get('/', (req, res) => res.send('<h1>BOTS ARE RUNNING! 🚀</h1>'));
app.listen(process.env.PORT || 3000, () => {
    console.log("🟢 Keep-alive server is Online!");
    // تشغيل البوتات بعد ما يشتغل السيرفر
    BOT_INFOS.forEach(info => setTimeout(() => createBot(info), info.joinDelay));
});