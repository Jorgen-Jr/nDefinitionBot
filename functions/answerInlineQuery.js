const axios = require('axios');

exports.handler = async event => {
    console.log("Sending result to the user.");

    const body = event.body;

    const response = JSON.parse(body);

    const bot_url = "https://api.telegram.org/bot" + process.env.BOT_TOKEN;

    console.log('BOT endpoint: ' + bot_url);

    const res = await axios.post(bot_url + '/answerInlineQuery', response);

    success = res.status === 200 ? true : false;

    return {

        statusCode: success ? 200 : 400,

        body: JSON.stringify({ success }),

    }

}