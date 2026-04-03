const mineflayer = require('mineflayer');
const express = require('express');

const SERVER_HOST = "Hshm.aternos.me";
const SERVER_PORT = 16821;
const VERSION = "1.21.1";

const BOT_INFOS = [
    { username: "Hashem657", joinDelay: 5000 },
    { username: "Hashem888", joinDelay: 20000 }, // زدت الوقت شوي عشان أترنوس ما يكرش
];

const activeBots = {}; // عشان نضمن ما نشغل نفس البوت مرتين

function createBot(info) {
    if (activeBots[info.username]) return; // إذا البوت شغال أصلاً لا تسوي واحد ثاني

    console.log(`📡 [${info.username}] جاري محاولة الدخول...`);
    
    const bot = mineflayer.createBot({
        host: SERVER_HOST,
        port: SERVER_PORT,
        username: info.username,
        version: VERSION,
        connectTimeout: 60000,
    });

    activeBots[info.username] = bot;

    bot.on('spawn', () => {
        console.log(`✅ كفووو! [${info.username}] رسبن في السيرفر.`);
        
        // نظام حركة ذكي (كل 30 ثانية حركات متنوعة)
        if (bot.afkInterval) clearInterval(bot.afkInterval);
        bot.afkInterval = setInterval(() => {
            if (!bot.entity) return;
            const actions = ['forward', 'back', 'left', 'right', 'jump'];
            const action = actions[Math.floor(Math.random() * actions.length)];
            
            bot.setControlState(action, true);
            bot.swingArm('right'); // يحرك يده (مهم جداً ضد الصنمية)
            
            setTimeout(() => {
                if (bot.entity) bot.clearControlStates();
            }, 1000);
            
            bot.look(Math.random() * Math.PI * 2, 0);
        }, 30000); 
    });

    // تسجيل الدخول التلقائي (لو السيرفر فيه بلجن AuthMe)
    bot.on('messagestr', (msg) => {
        if (msg.includes('/login')) bot.chat('/login 123456');
        if (msg.includes('/register')) bot.chat('/register 123456 123456');
    });

    bot.on('error', (err) => {
        console.log(`❌ [${info.username}] خطأ: ${err.message}`);
    });

    bot.on('end', (reason) => {
        console.log(`⚠️ [${info.username}] فصل الاتصال (${reason}).. بحاول أرجع بعد 30 ثانية`);
        if (bot.afkInterval) clearInterval(bot.afkInterval);
        delete activeBots[info.username]; // نحذفه من القائمة عشان نقدر نشغله ثاني
        
        // تأخير محترم قبل إعادة المحاولة عشان ما نبلع باند
        setTimeout(() => createBot(info), 30000);
    });

    bot.on('kicked', (reason) => {
        console.log(`🚫 [${info.username}] انطرد بسبب: ${reason}`);
    });
}

const app = express();
app.get('/', (req, res) => res.send('<h1>BOTS ARE STABLE! 🛡️</h1>'));
app.listen(process.env.PORT || 3000, () => {
    console.log("🟢 Web Server Online!");
    
    BOT_INFOS.forEach(info => {
        setTimeout(() => createBot(info), info.joinDelay);
    });
});
