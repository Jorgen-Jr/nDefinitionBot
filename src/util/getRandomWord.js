const rp = require('request-promise');
const $ = require('cheerio');

const url = "https://randomword.com/";

module.exports = async () => {
    return rp(url).then(async (html) => {

        const word = await $('#random_word', html).text();

        console.log('Random word found: ' + word);

        return word;
    }).catch(error => {
        console.log(error);
        return false;
    });
}