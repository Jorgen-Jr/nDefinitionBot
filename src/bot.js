
const TelegramBot = require('node-telegram-bot-api');
const ThesaurusScrapper = require('./controllers/ThesaurusScrapper');
const UrbanDictionaryScrapper = require('./controllers/UrbanDictionaryScrapper');

const token = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.on('inline_query', async (query) => {
  const queryId = query.id;
  const queryContent = query.query.replace(' ', '%20');
  let results = [];

  if (queryContent) {
    
  }

  bot.answerInlineQuery(queryId, results)
});

// Listen for any kind of message.
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  // let title = "";
  // let prep = "";
  // let ingr = [];

  // const req = {
  //   title, prep, ingr
  // }
  
  // const response = await NutritionController.getRecipeDetails(req);

  // console.log(response);

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Sorry, coudn\'t catch that 😢 \nPlease use only inline commands for now.');
});