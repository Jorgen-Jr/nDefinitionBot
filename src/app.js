const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

//Allow cors access
app.use(cors());

//Allow json requests.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Carregar as variáveis de enviromnent.
if (process.env.NODE_ENV !== 'production') {
  if (process.env.NODE_ENV === 'test') {
      require('dotenv').config({
          path: '.env.test',
      });
  }else{
    require('dotenv').config({
        path: '.env',
    });
  }
}

require('./bot');

router.get('/', (req, res) => {
  res.json({ message: "I'm working hooman!" });
});

//Import all the controller
const ThesaurusScrapper = require('./controllers/ThesaurusScrapper');
const UrbanDictionaryScrapper = require('./controllers/UrbanDictionaryScrapper');
const PriberamScrapper = require('./controllers/PriberamScrapper');

//Use thesaurus
router.get('/thesaurus/:word', async (req, res) => {
  const { word } = req.params;
  
  const response = await ThesaurusScrapper.getWordDefinition(word);

  return res.send(response);
});

//Use Urban Dictionary
router.get('/urbandictionary/:word', async (req, res) => {
  const { word } = req.params;
  
  const response = await UrbanDictionaryScrapper.getWordDefinition(word);

  return res.send(response);
});

//Use Priberam 
router.get('/priberam/:word', async (req, res) => {
  const { word } = req.params;
  
  const response = await PriberamScrapper.getWordDefinition(word);

  return res.send(response);
});

module.exports = app.use('', router);
