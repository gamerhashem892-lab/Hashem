const mineflayer = require('mineflayer');
const express = require('express');
const SERVER_HOST = "Modcraft-gYuZ.aternos.me"
const SERVER_PORT = 43889
const VERSION = "1.21.1"
const BOT_INFOS = [
    { username: "hashem_bot1", joinDelay: 0 },
    { username: "hashem_bot2", joinDelay: 60000 },
]
const RECONNECT_DELAY = 30000
const ANTI_AFK_INTERVAL = 30000

function createBot({ username }) {
    let bot = null;
    let reconnectTimeout = null;
    let afkInterval = null;

    function startBot() {
        bot = mineflayer.createBot({
            host: SERVER_HOST,
            port: SERVER_PORT,
            username: username,
            version: VERSION,
        });

        function onPlayerJoined(player) {
            if (!player || !player.username || player.username === bot.username) return;
            bot.chat(`Welcome to Mods Server, ${player.username}!`);
        }

        function antiAfk() {
            if (bot && bot.entity) {
                bot.swingArm();
            }
        }

        function cleanUp() {
            try {
                if (bot) {
                    bot.removeAllListeners();
                    bot.quit();
                }
            } catch(e) {}

            if (afkInterval) clearInterval(afkInterval);
            afkInterval = null;
        }

        bot.on('playerJoined', onPlayerJoined);
        bot.on('spawn', () => {
            if (afkInterval) clearInterval(afkInterval);
            afkInterval = setInterval(antiAfk, ANTI_AFK_INTERVAL);
        });

        const onDisconnect = (reason) => {
            cleanUp();
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
            reconnectTimeout = setTimeout(startBot, RECONNECT_DELAY);
        };

        bot.on('end', onDisconnect);
        bot.on('kicked', onDisconnect);
        bot.on('error', onDisconnect);
    }

    startBot();
}

BOT_INFOS.forEach((botInfo, idx) => {
    setTimeout(() => createBot(botInfo), botInfo.joinDelay);
});

const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.status(200).send('OK'));
app.listen(PORT, () => {
    console.log(`Keep-alive server running on port ${PORT}`);
});
