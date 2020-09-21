# nDefinitionBot

I wanted to test out how telegram bots works, so I made this little bot that give you the definition of a word through inline commands.

It should return a list with the definition for the given word.

### Usage

Start typing `@ndefinitionbot` in any chat and it will show what definitions there is for the desired word. It's a fair simple bot.

### API Routes

You can also send requests to `/thesaurus/{word}`,`/urbandictionary/{word}` and `/priberam/{word}` to get the definition in json format.

### Options
You will have the following options when entering the word.
 - Thesaurus (With the english definition)
 - Urban Dictionary (With the Urban Dictionary definition in case of slangs)
 - Priberam (With the portuguese definition)
 
### External References
This bot uses the following sources:
 - [Thesaurus](http://word.com);
 - [UrbanDictionary](http://urbandictionary.com);
 - [Priberam](https://dicionario.priberam.org);
 
 ### Incoming
 - [Dicionário Popular](https://www.dicionariopopular.com/);
