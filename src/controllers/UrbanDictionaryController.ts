import thedictapi from "../services/thedictapi";

import { Definition, InlineQueryResult } from "./../types";

export default async (word: string) => {
  let results: InlineQueryResult[] = [];

  const definitionsUrbanDictionary = await thedictapi
    .get("/urbandictionary?word=" + word)
    .then((res) => {
      return res.data;
    });

  if (definitionsUrbanDictionary) {
    if (definitionsUrbanDictionary.length > 0) {
      definitionsUrbanDictionary.forEach(
        (definitionUrbanDictionary: Definition) => {
          results.push({
            type: "Article",
            id: "UrbanDictionary" + results.length,
            title: "Urban Dictionary",
            thumb_url:
              "http://www.extension.zone/wp-content/uploads/2015/11/Urban-Dictionary-logo.png",
            description:
              definitionUrbanDictionary.word.toUpperCase() +
              " " +
              definitionUrbanDictionary.definition,
            input_message_content: {
              parse_mode: "HTML",
              message_text:
                "<b><i>" +
                definitionUrbanDictionary.word +
                "</i></b> \n\n" +
                "<b>Definition:</b> " +
                definitionUrbanDictionary.definition +
                "\n\n" +
                "<b>Example:</b> <i>" +
                definitionUrbanDictionary.examples +
                "</i> \n" +
                '\n <a href="' +
                definitionUrbanDictionary.source +
                '">Source</a>',
            },
          });
        }
      );
    }
  }

  return results;
};
