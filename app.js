const telegraf = require('telegraf');
const axios = require('axios');
require('dotenv').config()
const express = require('express');

const app = express();
const port = process.env.PORT ?? 3000;

app.get('*', (req, res) => {
    res.end({'success': true});
})

const bot = new telegraf.Telegraf(process.env.TELEGRAM_BOT_KEY);

bot.start((ctx) => ctx.reply("welcome"));

bot.hears(/.*gpt.*/i, async (ctx) => {
    let message = ctx.update.message.text.toLowerCase().replace("gpt", "")

    const sesionHeaders = {
        "accept": "*/*",
        "accept-language": "es-ES,es;q=0.9,en;q=0.8,zh-TW;q=0.7,zh-CN;q=0.6,zh;q=0.5",
        "baggage": "sentry-environment=production,sentry-release=ad70942a7ddce75e6cc14ea7bcbb5488bf0d4f82,sentry-transaction=%2Fchat,sentry-public_key=59ce18e17b14dd59288bbfa2c2cfbaa6,sentry-trace_id=abafdf141c6549c589d425c2eb81b47f,sentry-sample_rate=0.2",
        "content-type": "application/json",
        "if-none-match": "W/\"17hxkie70w0mr\"",
        "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "sentry-trace": "abafdf141c6549c589d425c2eb81b47f-9892215d0333341e-0",
        "cookie": "__Host-next-auth.csrf-token=947efde886ab9f573d486e37d04d8deb739fae45a420fa77b48da6038cb70b56%7C06116e23bb81accbda10149646d903eeebc87f022de356f983ee6d6c97e84f41; __Secure-next-auth.callback-url=%2F; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..Ru2RyZy-2ieEW6bT.d3Z6iwvzoLgsIcV6GqxrBI90fGac_FUIk2mbiVL-tANZK1UkjXlAiORWKmlWkprEvIO8a6aWp1Dn_3XeynU1gaXU651vkrd0yvLhg_UMypbSVrBnMgz2Xe2YTLtcH2Lw2uA12-3Z5niUy6GWTe6LRHZCNhNHcaHu6LMNTdDiSZQMMyvYGVK1J4nmy2OT7fMiLrDBkSZsLnuymum4uESbHhihto00n_GbjMOTZ0eG3K1nxVEJ39rYCiHFhMPBF_0PV-BIOmCRrcEjgqVTw6AluCB8AMjf5qF47XtILQA5psiaIfFc6NirpMdAzYi8fXs54Tf7eKcmqwEPpKf3bcOet77NH6yaPn_-ugzM15dOnHIBfG8VEqku.wUhRjvx1DuEu4QnU1X-4jw; mp_a44b0bc977d2c56bbe900386ad3af00a_mixpanel=%7B%22distinct_id%22%3A%20%22qDmt-4lUUeCE7l9IAGhUC%22%2C%22%24device_id%22%3A%20%2218abedeeb9655b-08b8a818efc3ab-11462c6c-1fa400-18abedeeb9655b%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%2C%22%24search_engine%22%3A%20%22google%22%2C%22%24user_id%22%3A%20%22qDmt-4lUUeCE7l9IAGhUC%22%7D; mp_a44b0bc977d2c56bbe900386ad3af00a_mixpanel=%7B%22distinct_id%22%3A%20%22qDmt-4lUUeCE7l9IAGhUC%22%2C%22%24device_id%22%3A%20%2218abedeeb9655b-08b8a818efc3ab-11462c6c-1fa400-18abedeeb9655b%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%2C%22%24search_engine%22%3A%20%22google%22%2C%22%24user_id%22%3A%20%22qDmt-4lUUeCE7l9IAGhUC%22%7D",
        "Referer": "https://flowgpt.com/chat",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    }

    const sesionData = await axios.get('https://flowgpt.com/api/auth/session', { headers: sesionHeaders })

    const token = sesionData.data.user.encodeToken

    const headers = {
        "accept": "*/*",
        "accept-language": "es-ES,es;q=0.9,en;q=0.8,zh-TW;q=0.7,zh-CN;q=0.6,zh;q=0.5",
        "authorization": "Bearer " + token,
        "content-type": "application/json",
        "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "sec-gpc": "1",
        "Referer": "https://flowgpt.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    }

    const payload = {
        conversationId: "2e56898d-f2ee-479f-a5ed-bf9fb8522f41",
        documentIds: [],
        history: [],
        model: "gpt-3.5-turbo",
        question: message,
        streaming: true,
        system: "hola",
        temperature: 0.7,
        userId: "qDmt-4lUUeCE7l9IAGhUC",
    }

    const data = await axios.post('https://backend.flowgpt.com/chat', payload, { headers: headers })
    console.log({ RESULTS: data.data })
    ctx.reply(data.data);
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));


app.listen(port, () => console.log(`App listening on port ${port}`))