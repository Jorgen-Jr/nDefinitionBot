
const TelegramBot = require('node-telegram-bot-api');
const ThesaurusScrapper = require('./controllers/ThesaurusScrapper');
const UrbanDictionaryScrapper = require('./controllers/UrbanDictionaryScrapper');
const Definition = require('./models/Definition');

const token = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.on('inline_query', async (query) => {
  const queryId = query.id;
  const queryContent = query.query.replace(' ', '%20');
  let results = [];

  if (queryContent) {
    
    const definition = await ThesaurusScrapper.getWordDefinition(queryContent);

    const definitions = definition.definition.map(def => {
      const all_definitions = def.definitions.map(def => {
        return '<i>' + def.index + '</i> ' + def.definition[0];
      });

      return '<i>' + def.category + '</i> \n' + all_definitions.join('\n');
    });

    results.push({
        type: 'Article',
        id: results.length,
        title: "Thesaurus",
        description: definition.word.toUpperCase() + ' ' + definition.definition[0].definitions[0].definition,
        input_message_content: {
          parse_mode: 'HTML',
          message_text: '<b><i>' + definition.word + '</i></b> \n' +
          definitions.join('\n') +
          '\n <a href="' + definition.source + '">Source</a>'
        },
      });

  }

  bot.answerInlineQuery(queryId, results)
});

// Listen for any kind of message.
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  // const response = await NutritionController.getRecipeDetails(req);

  // console.log(response);

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Sorry, coudn\'t catch that 😢 \nPlease use only inline commands for now.');
});