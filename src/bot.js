const TelegramBot = require('node-telegram-bot-api');
const thedictapi = require('./services/thedictapi');
const getRandomWord = require('./util/getRandomWord');

const token = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.on('inline_query', async (query) => {
  const queryId = query.id;
  const queryContent = query.query.replace(' ', '%20') || await getRandomWord();
  let results = [];

  if (queryContent) {
    //Catch the word from TheSaurus
    try {
      const definitionThesaurus = await thedictapi.get('/thesaurus/' + queryContent).then(res => { return res.data });

      if (definitionThesaurus) {
        const definitionsThesaurus = definitionThesaurus.definition.map(def => {
          const all_definitions = def.definitions.map(def => {
            return '<i>' + def.index + '</i> ' + def.definition;
          });

          return '\n<i>' + def.category + '</i> \n\n' + all_definitions.join('\n');
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
      }
    } catch (error) {
      console.log(error);
    }

    // Catch the word from Priberam
    try {
      const definitionPriberam = await thedictapi.get('/priberam/' + queryContent).then(res => { return res.data });

      if (definitionPriberam) {
        const definitionsPriberam = definitionPriberam.definition.map(def => {
          if (def.index === 0) {
            return '<b><i>' + def.definition + '</i></b>';
          } else {
            return '<b><i>' + def.index + '</i></b> ' + def.definition;
          }
        });

        results.push({
          type: 'Article',
          id: results.length,
          title: "Priberam",
          thumb_url: 'https://img.ibxk.com.br/2014/2/programas/9695104192743330.png',
          description: definitionPriberam.word + ' ' + definitionPriberam.definition[0].definition,
          input_message_content: {
            parse_mode: 'HTML',
            message_text: '<b><i>' + definitionPriberam.word + '</i></b> \n' +
              definitionsPriberam.join('\n') +
              '\n\n <a href="' + definitionPriberam.source + '">Source</a>'
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Catch the word from Urban Dictionary
  try {
    const definitionsUrbanDictionary = await thedictapi.get('/urbandictionary/' + queryContent).then(res => { return res.data });

    console.log(definitionsUrbanDictionary);
    if (definitionsUrbanDictionary) {

      definitionsUrbanDictionary.forEach(definitionUrbanDictionary => {
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
      });
    }
  } catch (error) {
    console.log(error);
  }

  if (results.length <= 0) {
    results.push({
      type: 'Article',
      id: results.length,
      title: "Not Found",
      thumb_url: 'https://muwado.com/wp-content/uploads/2014/06/sad-smiley-face.png',
      description: ":(",
      input_message_content: {
        parse_mode: 'HTML',
        message_text: ":("
      },
    });
  }

  bot.answerInlineQuery(queryId, results)
});

// Listen for any kind of message.
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Sorry, coudn\'t catch that 😢 \nPlease use only inline commands for now.');
});