/* 
The update object telegram is expected to send is
{
    update_id,
    message,
    edited_message,
    channel_post,
    edited_channel_post,
    inline_query?: {
        id,
        from,
        location,
        query,
        offset,
    },
    chosen_inline_result,
    callback_query,
    shipping_query,
    pre_checkout_query,
    poll,
    poll_answer,
}
from the body of it's request.

the answer it is expecting is
{
    inline_query_id,
    results: [
        {
            type,
            id,
            title,
            input_message_content,
            reply_markup,
            url,
            hide_url,
            description,
            thumb_url,
            thumb_width,
            thumb_height,
        }  
    ]
    cache_time,
    is_personal?,
    next_offset?,
    switch_pm_text?,
    switch_pm_parameter?,
}
for inline queries or
{
    chat_id,
    text,
    parse_mode,
    entities,
    disable_web_page_preview,
    disable_notification,
    reply_to_message_id,
    allow_sending_without_reply,
    reply_markup,
}
Let's get to it.
*/

const ThesaurusController = require("../dist/controllers/ThesaurusController");
const PriberamController = require("../dist/controllers/PriberamController");
const UrbanDictionaryController = require("../dist/controllers/UrbanDictionaryController");

const getRandomWord = require("../dist/util/getRandomWord");

const axios = require('axios');
const { parse } = require("ts-node");

exports.handler = async event => {

    const body = event.body;

    const req = JSON.parse(body);

    const {
        update_id,
        message,
        inline_query,
    } = req;

    console.log('Update received: ', req);

    console.log("inline_query object: ", req.inline_query);

    console.log("message received: ", req.message);

    const bot_url = "https://api.telegram.org/bot" + process.env.BOT_TOKEN;

    console.log('BOT endpoint: ' + bot_url);

    let response = {};

    let word = "";

    if (inline_query) {
        word = inline_query.query.replace(" ", "%20") || (await getRandomWord.default());
    } else if (message) {
        word = message.text;
    }

    let results = [];

    if (word) {
        console.log(
            new Date().toUTCString() + " - Fetching word: " + word
        );

        //Catch the word from TheSaurus
        results.push(...(await ThesaurusController.default(word)));

        //Fetch results from Priberam
        results.push(...(await PriberamController.default(word)));

        //Catch the word from Urban Dictionary
        results.push(...(await UrbanDictionaryController.default(word)));
    }

    if (inline_query) {
        if (results.length === 0) {
            results.push({
                type: "Article",
                id: "404_" + results.length,
                title: "Not Found",
                thumb_url:
                    "https://muwado.com/wp-content/uploads/2014/06/sad-smiley-face.png",
                description: ":(",
                input_message_content: {
                    parse_mode: "HTML",
                    message_text: ":(",
                },
            });
        }

        /* Answer said query. */

        await axios.post(bot_url + '/answerInlineQuery', response);

    } else if (message) {
        const chatId = message.chat.id;

        console.log(chatId, results);

        /* 
            Answer message.
        */

        // send a message to the chat acknowledging receipt of their message
        const parse_mode = { parse_mode: "HTML" };

        if (results.length === 0) {
            // send a message in case it doesn't find anything.
            sendMessage("Sorry, coudn't catch that 😢 \nPlease use only inline commands for now.")
        }


        results.forEach((result) => {
            sendMessage(result.input_message_content.message_text);
        });

        async function sendMessage(text) {
            await axios.post(bot_url + '/sendMessage', {
                chatId,
                text,
                parse_mode
            });
        }
    }

    response = {
        update_id,
        results
    }

    console.log("Response generated: ", response);

    return {
        statusCode: 200,

        body: JSON.stringify(response),
    }

}