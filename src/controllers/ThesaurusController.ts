import thedictapi from "../services/thedictapi";
import { DefinitionObject, InlineQueryResult } from "src/types";

export default async (word: string) => {
  let results: InlineQueryResult[] = [];

  const definitionThesaurus = await thedictapi
    .get("/thesaurus/" + word)
    .then((res) => {
      return res.data;
    });

  if (definitionThesaurus.word) {
    const definitionsThesaurus = definitionThesaurus.definition.map(
      (def: DefinitionObject) => {
        const all_definitions = def.definitions?.map((def) => {
          return "<i>" + def.index + "</i> " + def.definition;
        });

        return "\n<i>" + def.category + "</i> \n" + all_definitions?.join("\n");
      }
    );

    results.push({
      type: "Article",
      id: "Thesaurus" + results.length,
      title: "Thesaurus",
      thumb_url:
        "https://3.bp.blogspot.com/-orTOtEr_7M4/WbSpGZSNEVI/AAAAAAAAahY/J8GpIYK2rBsmeTQFzZYjhmUK96mdBpxXQCLcBGAs/s1600/thesaurus-logo.jpg",
      description:
        definitionThesaurus.word.toUpperCase() +
        " " +
        definitionThesaurus.definition[0].definitions[0].definition,
      input_message_content: {
        parse_mode: "HTML",
        message_text:
          "<b><i>" +
          definitionThesaurus.word +
          "</i></b> \n" +
          definitionsThesaurus.join("\n\n") +
          '\n <a href="' +
          definitionThesaurus.source +
          '">Source</a>',
      },
    });
  }

  return results;
};
