
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

    try {

      //Catch the word from TheSaurus
      const definitionThesaurus = await ThesaurusScrapper.getWordDefinition(queryContent);

      const definitionsThesaurus = definitionThesaurus.definition.map(def => {
        const all_definitions = def.definitions.map(def => {
          return '<i>' + def.index + '</i> ' + def.definition;
        });

        return '\n<i>' + def.category + '</i> \n' + all_definitions.join('\n');
      });

      results.push({
        type: 'Article',
        id: results.length,
        title: "Thesaurus",
        thumb_url: 'https://3.bp.blogspot.com/-orTOtEr_7M4/WbSpGZSNEVI/AAAAAAAAahY/J8GpIYK2rBsmeTQFzZYjhmUK96mdBpxXQCLcBGAs/s1600/thesaurus-logo.jpg',
        description: definitionThesaurus.word.toUpperCase() + ' ' + definitionThesaurus.definition[0].definitions[0].definition,
        input_message_content: {
          parse_mode: 'HTML',
          message_text: '<b><i>' + definitionThesaurus.word + '</i></b> \n' +
            definitionsThesaurus.join('\n') +
            '\n <a href="' + definitionThesaurus.source + '">Source</a>'
        },
      });
    } catch (error) {
      console.log(error);
    }

    //Catch the word from Urban Dictionary


    try {
      const definitionUrbanDictionary = await UrbanDictionaryScrapper.getWordDefinition(queryContent);

      results.push({
        type: 'Article',
        id: results.length,
        title: "Urban Dictionary",
        thumb_url: 'http://www.extension.zone/wp-content/uploads/2015/11/Urban-Dictionary-logo.png',
        description: definitionUrbanDictionary.word.toUpperCase() + ' ' + definitionUrbanDictionary.definition,
        input_message_content: {
          parse_mode: 'HTML',
          message_text: '<b><i>' + definitionUrbanDictionary.word + '</i></b> \n\n' +
            '<b>Definition:</b> ' + definitionUrbanDictionary.definition + '\n\n' +
            '<b>Example:</b> <i>' + definitionUrbanDictionary.examples + '</i> \n' +
            '\n <a href="' + definitionUrbanDictionary.source + '">Source</a>'
        },
      });
    } catch (error) {
      console.log(error);
    }
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