import thedictapi from "../services/thedictapi";
import { InlineQueryResult } from "src/types";

export default async (word: string) => {
  let results: InlineQueryResult[] = [];

  const definitionDicio = await thedictapi.get("/dicio?word=" + word).then((res: any) => {
    return res.data;
  });

  definitionDicio.forEach((dicio_definition: any) => {
    if (dicio_definition.definition) {
      if (dicio_definition.definition.length > 0) {
        try {
          const definitionsDicio = dicio_definition.definition.map((def: String) => {
            return def;
          });

          const examplesDicio = dicio_definition.example.map((example: String) => {
            return "<i>" + example + "</i> ";
          });

          results.push({
            type: "Article",
            id: "Dicio" + results.length,
            title: "Dicio",
            thumb_url: "https://www.dicio.com.br/favicon-96x96.png",
            description: dicio_definition.word.toUpperCase() + " " + dicio_definition.definition[0],
            input_message_content: {
              parse_mode: "HTML",
              message_text: "<b><i>" + word + "</i></b> \n" + definitionsDicio.join("\n") + examplesDicio.join("\n"),
            },
            reply_markup: [
              {
                text: "Fonte",
                url: definitionDicio.source,
              },
            ],
          });
        } catch (err) {
          console.error("Houston? We got an issue at Dicio.", err);
        }
      }
    }
  });

  return results;
};
