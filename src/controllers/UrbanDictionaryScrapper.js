const rp = require('request-promise');
const $ = require('cheerio');

// const Definition = require('./../models/Definition');

const url = "https://www.dictionary.com/browse/";

module.exports = {
    async getWordDefinition(word){
        return rp(url + word).then(async (html) => {
            
        });
    }
}