const rp = require('request-promise');
const $ = require('cheerio');

const Definition = require('./../models/Definition');

const url = "https://www.dictionary.com/browse/";

module.exports = {
    async getWordDefinition(word) {
        return rp(url + word).then(async (html) => {
            let definition = new Definition(url + word);

            //Returns the found word
            definition.word = await $('.e1rg2mtf5 > h1', html).text().toUpperCase();

            //Returns word definition
            const first_definition = $('.css-1fj93w9', html)[0];

            await $('section', first_definition).map(async (index, definition_element) => {
                // Skip the first element, since it's a header for informations about...
                if (index !== 0) {
                    let category = $.text(await $('h3', definition_element))

                    let return_def = {};

                    return_cat_definition = [];

                    await definition_element.children.forEach(async (definition_index) => {
                        $('.default-content > div', definition_index).map((_, def) => {

                            let index = def.attribs.value;

                            let definition = [];

                            definition = $.text($('span', def));

                            return_cat_definition.push({
                                index,
                                definition,
                            });
                        });

                        $('.expandable-content > div', definition_index).map((_, def) => {
                            let index = def.attribs.value;

                            let definition = [];

                            definition = $.text($('span', def));

                            return_cat_definition.push({
                                index,
                                definition,
                            })
                        });

                        return_def = {
                            category,
                            definitions: return_cat_definition
                        }
                    });

                    console.log(return_cat_definition);

                    await definition.definition.push(return_def);
                }
            });

            return definition;
        })
            .catch(error => {
                console.log(error);
                return false;
            });
    }
}