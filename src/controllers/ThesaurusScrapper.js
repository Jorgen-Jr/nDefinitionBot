import rp from 'request-promise';
import $ from 'cheerio';

const url = "https://www.dictionary.com/browse/";

module.exports = {
    async getWordDefinition(word){
        return rp(url + word).then(async (html) => {
        
        });
    }
}