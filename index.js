const mineflayer = require('mineflayer');
const express = require('express');
const net = require('net');

// إعدادات السيرفر حقك
const SERVER_HOST = "Modcraft-gYuZ.aternos.me";
const SERVER_PORT = 43889;
const VERSION = "1.21.1";

// مصفوفة البوتات بأسماء جديدة تماماً
const BOT_INFOS = [
    { username: "Hashem_Super_1", joinDelay: 5000 },
    { username: "Hashem_Super_2", joinDelay: 35000 },
];

// 🔧 اختبر الاتصال بالسيرفر
function testConnection() {
    const socket = new net.Socket();
    socket.setTimeout(5000); // 5 ثواني timeout
    
    socket.on('connect', () => {
        console.log(`✅ اتصال الـ Network ناجح إلى ${SERVER_HOST}:${SERVER_PORT}`);
        console.error(`✅ اتصال الـ Network ناجح إلى ${SERVER_HOST}:${SERVER_PORT}`);
        socket.destroy();
    });
    
    socket.on('timeout', () => {
        console.error(`⏱️ انتظر طويل جداً (timeout) - السيرفر لا يستجيب`);
        console.error(`⏱️ تأكد من:`);
        console.error(`   - اسم السيرفر: ${SERVER_HOST}`);
        console.error(`   - الـ Port: ${SERVER_PORT}`);
        console.error(`   - السيرفر يعمل حالياً`);
        socket.destroy();
    });
    
    socket.on('error', (err) => {
        console.error(`❌ خطأ الاتصال: ${err.message}`);
        console.error(`❌ تأكد من:`);
        console.error(`   - اسم السيرفر: ${SERVER_HOST}`);
        console.error(`   - الـ Port: ${SERVER_PORT}`);
        console.error(`   - السيرفر يعمل حالياً`);
    });
    
    socket.connect(SERVER_PORT, SERVER_HOST);
}

function createBot({ username }) {
    console.log(`📡 [${username}] جاري محاولة الدخول الآن...`);
    console.error(`📡 [${username}] جاري محاولة الدخول الآن...`);
    
    const bot = mineflayer.createBot({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: username,
        version: VERSION,
    });

    // ✅ حدث عند الاتصال بنجاح
    bot.on('connect', () => {
        console.log(`🔗 [${username}] تم الاتصال بالسيرفر بنجاح!`);
        console.error(`🔗 [${username}] تم الاتصال بالسيرفر بنجاح!`);
    });

    // ✅ حدث عند الدخول الفعلي
    bot.on('spawn', () => {
        console.log(`✅ كفووو! [${username}] دخل السيرفر بنجاح.`);
        console.error(`✅ كفووو! [${username}] دخل السيرفر بنجاح.`);
        bot.chat("Hashem's Bot is here! 🛡️");
    });

    // ❌ أخطاء الاتصال
    bot.on('error', (err) => {
        console.log(`❌ [${username}] خطأ: ${err.message}`);
        console.error(`❌ [${username}] خطأ: ${err.message}`);
        console.error(`❌ [${username}] Error Details:`, err);
    });

    // ❌ قطع الاتصال
    bot.on('end', () => {
        console.log(`⚠️ [${username}] فصل.. بحاول أرجع بعد 30 ثانية`);
        console.error(`⚠️ [${username}] فصل.. بحاول أرجع بعد 30 ثانية`);
        setTimeout(() => createBot({ username }), 30000);
    });

    // ❌ مشاكل الاتصال
    bot.on('kicked', (reason) => {
        console.log(`🚫 [${username}] تم طرده من السيرفر: ${reason}`);
        console.error(`🚫 [${username}] تم طرده من السيرفر: ${reason}`);
    });

    // ❌ مشاكل الموثقية
    bot.on('login', () => {
        console.log(`📝 [${username}] تم تسجيل الدخول بنجاح`);
        console.error(`📝 [${username}] تم تسجيل الدخول بنجاح`);
    });

    return bot;
}

// تشغيل السيرفر عشان Render ما يطفي
const app = express();
app.get('/', (req, res) => res.send('<h1>BOTS ARE RUNNING! 🚀</h1>'));

app.listen(process.env.PORT || 3000, () => {
    const startTime = new Date().toISOString();
    console.log("🟢 Keep-alive server is Online!");
    console.error("🟢 Keep-alive server is Online!");
    console.log(`⏰ Server started at ${startTime}`);
    console.error(`⏰ Server started at ${startTime}`);
    console.log(`🎮 Server: ${SERVER_HOST}:${SERVER_PORT}`);
    console.error(`🎮 Server: ${SERVER_HOST}:${SERVER_PORT}`);
    
    // 🔧 بدء اختبار الاتصال
    console.log("🔧 بدء اختبار الاتصال...");
    console.error("🔧 بدء اختبار الاتصال...");
    testConnection();
    
    // تشغيل البوتات بعد ما يشتغل السيرفر
    BOT_INFOS.forEach(info => {
        console.log(`⏱️ تجهيز البوت ${info.username} - سيبدأ بعد ${info.joinDelay/1000} ثواني`);
        console.error(`⏱️ تجهيز البوت ${info.username} - سيبدأ بعد ${info.joinDelay/1000} ثواني`);
        setTimeout(() => createBot(info), info.joinDelay);
    });
});

// معالج الأخطاء العامة
process.on('uncaughtException', (err) => {
    console.error("❌ [FATAL] خطأ حرج:", err);
    console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error("❌ [FATAL] Promise rejection:", reason);
});