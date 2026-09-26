const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Telegram Bot Sazlamalary
const BOT_TOKEN = '8791476196:AAHZflANxMWs6K_Jgr-1dFP_mfYsxt0Ku38';
const ADMIN_CHAT_ID = '8144656432';
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Telefon belgisini barlamak (+993 61-65 / 71-72)
function isValidTmPhone(phone) {
    const regex = /^\+993(61|62|63|64|65|71|72)\d{6}$/;
    return regex.test(phone);
}

// Sargyt kabul etmek
app.post('/api/sargyt', (req, res) => {
    const { adynyz, telefon, harytLink, bellik } = req.body;

    if (!isValidTmPhone(telefon)) {
        return res.status(400).json({ success: false, message: 'Telefon belgisi näşat! (+993 6x/7x olmaly)' });
    }

    const habar = `🛒 *TÄZE SARGYT! (tkmchina.shop)*\n\n` +
                  `👤 *Müşderi:* ${adynyz}\n` +
                  `📞 *Telefon:* ${telefon}\n` +
                  `🔗 *Haryt Linki:* ${harytLink}\n` +
                  `📝 *Bellik:* ${bellik || 'Ýok'}`;

    bot.sendMessage(ADMIN_CHAT_ID, habar, { parse_mode: 'Markdown' })
        .then(() => {
            res.json({ success: true, message: 'Sargydyňyz üstünlikli kabul edildi!' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ success: false, message: 'Sargyt ugratmakda säwlik çykdy.' });
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer ${PORT} portunda işleýär...`);
});
