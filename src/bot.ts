import ThesaurusController from "./controllers/ThesaurusController";
import PriberamController from "./controllers/PriberamController";
import UrbanDictionaryController from "./controllers/UrbanDictionaryController";
import { InlineQueryResult, query } from "./types";

import TelegramBot from "node-telegram-bot-api";

import getRandomWord from "./util/getRandomWord";

const token = process.env.BOT_TOKEN;

let bot: TelegramBot | undefined = undefined;

if (token) {
  // Create a bot that uses 'polling' to fetch new updates
  bot = new TelegramBot(token, { polling: true });

  bot.on("inline_query", async (query: query) => {
    const queryContent =
      query.query.replace(" ", "%20") || (await getRandomWord());

    let results: InlineQueryResult[] = [];

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

    bot?.answerInlineQuery(query.id, results);
  });

  // Listen for any kind of message.
  bot.on("message", async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    const content = msg.text;

    let results: InlineQueryResult[] = [];

    if (content) {
      console.log(new Date().toUTCString() + " - Fetching word: " + content);

      //Catch the word from TheSaurus
      results.push(...(await ThesaurusController(content)));

      //Fetch results from Priberam
      results.push(...(await PriberamController(content)));

      //Catch the word from Urban Dictionary
      results.push(...(await UrbanDictionaryController(content)));
    }

    if (results.length === 0) {
      // send a message in case it doesn't find anything.
      bot?.sendMessage(
        chatId,
        "Sorry, coudn't catch that 😢 \nPlease use only inline commands for now."
      );
    }

    // send a message to the chat acknowledging receipt of their message
    const parse_mode: any = { parse_mode: "HTML" };

    results.forEach((result: InlineQueryResult) => {
      bot?.sendMessage(
        chatId,
        result.input_message_content.message_text,
        parse_mode
      );
    });
  });
}

export default bot;
