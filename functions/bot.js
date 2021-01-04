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

exports.handler = async event => {
    const {
        update_id,
        message,
        edited_message,
        channel_post,
        edited_channel_post,
        inline_query,
        chosen_inline_result,
        callback_query,
        shipping_query,
        pre_checkout_query,
        poll,
        poll_answer,
    } = event.body;

    let response = {};

    if (inline_query) {
        const queryContent =
            inline_query.query.replace(" ", "%20") || (await getRandomWord());

        let results = [];

        if (queryContent) {
            console.log(
                new Date().toUTCString() + " - Fetching word: " + queryContent
            );

            //Catch the word from TheSaurus
            results.push(...(await ThesaurusController(queryContent)));

            //Fetch results from Priberam
            results.push(...(await PriberamController(queryContent)));

            //Catch the word from Urban Dictionary
            results.push(...(await UrbanDictionaryController(queryContent)));
        }

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

        response = results;

    } else if (message) {

    }

    return {
        statusCode: 200,

        body: JSON.stringify(response),
    }

}