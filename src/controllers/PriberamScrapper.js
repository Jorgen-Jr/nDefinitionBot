const rp = require('request-promise');
const $ = require('cheerio');

const Definition = require('../models/Definition');

const url = "https://dicionario.priberam.org/";

module.exports = {
    async getWordDefinition(word) {
        return rp(url + word).then(async (html) => {
            let definition = new Definition(url + word);

            //Returns word with top definition
            const def_card = await $('#resultados', html);

            definition.word = word;
            
            await $('.def', def_card).map(async (index, def) => {
                const text = await $.text(def.children);
                
                definition.definition.push({
                    index,
                    definition: text,
                })
            });

            return definition;
        })
        .catch(error => {
            console.log(error);
            return false;
        });
    }
}