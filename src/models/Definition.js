class Definition {
    constructor(source_url){
        this.word = '';
        this.definition = [];
        this.source = source_url;
        this.synonyms = [];
        this.antonyms = [];
        this.examples = [];
    }
}

module.exports = Definition;