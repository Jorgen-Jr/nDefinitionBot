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

            definition.word = def_card[0].childNodes[1].children[1].children[1].children[1].children[0].firstChild.firstChild.data;
            
            console.log((def_card[0].childNodes[1].children[1].children[1].children[1].children[0].firstChild.firstChild.data));

            await $('.def', def_card).map(async (index, def) => {
                const text = await $.html(def.children);
                
                console.log(await $.text(def.children));

                definition.definition.push({
                    index,
                    definition: text,
                })
            });

            return definition;
        })
        .catch(error => {
            console.log(error);
            return error.message;
        });
    }
}