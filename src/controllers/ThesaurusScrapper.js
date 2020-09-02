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
                    await definition_element.children.forEach(async (definition_section, index) => {
                        if (index !== 0) {
                            let category = $.text(definition_section.firstChild.children);

                            let return_def = {};

                            return_cat_definition = [];

                            await definition_section.children.forEach(async (definition_index) => {

                                definition_index.children.forEach(async (definition_data) => {
                                    let index = definition_data.attribs.value;

                                    let definition = [];

                                    if (definition_data.attribs.class.startsWith('expandable')) {
                                        definition_data.firstChild.children.forEach(child => {
                                            index = child.attribs.value;
                                            const this_data = $.text(child.children);

                                            definition.push(this_data)

                                            return_cat_definition.push({
                                                index,
                                                definition: this_data,
                                            })
                                        });

                                    } else {

                                        if (index) {

                                            definition_data.childNodes.forEach((data_span) => {
                                                const this_data = $.text(data_span.children);

                                                definition.push(this_data);
                                            });

                                            return_cat_definition.push({
                                                index,
                                                definition,
                                            })
                                        }
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
            .catch(error => {
                console.log(error);
                return false;
            });
    }
}