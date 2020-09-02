const rp = require('request-promise');
const $ = require('cheerio');

const Definition = require('./../models/Definition');

const url = "https://www.urbandictionary.com/define.php?term=";

module.exports = {
    async getWordDefinition(word) {
        return rp(url + word).then(async (html) => {
            let definition = new Definition(url + word);

            //Returns word with top definition
            const def_panel = await $('.def-panel', html)[0];
            
            //Returns the word found at website.
            definition.word = await $('.word', def_panel).text();

            //Returns the word definition 
            definition.definition = await $('.meaning', def_panel).text();

            //Returns the word example
            definition.examples = await $('.example', def_panel).text();

            return definition;
        })
        .catch(error => {
            console.log(error);
            return false;
        });
    }
}