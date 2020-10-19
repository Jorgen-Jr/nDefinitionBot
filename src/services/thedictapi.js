const api = require('axios');

const numbersapi = api.create({
    baseURL: 'https://thedictapi.herokuapp.com/',
});

module.exports = numbersapi;