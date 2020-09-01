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
            await $('.css-1urpfgu', html).map(async (index, definition_element) => {
                if (index === 0) {
                    let value = {};

                    await definition_element.children.forEach(async (definition_section, index) => {
                        if (index !== 0) {
                            let category = '';
                            await definition_section.firstChild.children.forEach(cat => {
                                console.log(cat.firstChild);

                                category += cat.data;
                            });

                            let return_def = {};

                            return_cat_definition = [];

                            await definition_section.children.forEach(async (definition_index) => {

                                definition_index.children.forEach(async (definition_data) => {
                                    const index = definition_data.attribs.value;

                                    let definition = [];

                                    // console.log(definition_data.contents())

                                    if (index) {

                                        definition_data.childNodes.forEach((data_span, index) => {

                                            const child = data_span.firstChild.firstChild ? data_span.firstChild.firstChild.data : '';
                                            const this_data = data_span.firstChild ? data_span.firstChild.data ? data_span.firstChild.data : '': '';

                                            definition.push(this_data + child);
                                        });

                                        return_cat_definition.push({
                                            index,
                                            definition,
                                        })
                                    }

                                });

                                return_def = {
                                    category,
                                    definitions: return_cat_definition
                                }
                                
                            });

                            await definition.definition.push(return_def);
                        }
                    });
                }
            });

            return definition;
        })
            .catch(item => {
                console.log(item);
                return false;
            });
    }
}