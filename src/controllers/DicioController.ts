import thedictapi from "../services/thedictapi";
import { InlineQueryResult } from "src/types";

export default async (word: string) => {
  let results: InlineQueryResult[] = [];

  const definitionDicio = await thedictapi.get("/dicio?word=" + word).then((res: any) => {
    return res.data;
  });

  definitionDicio.forEach((dicio_definicion: any) => {
    if (dicio_definicion.definition) {
      if (dicio_definicion.definition.length > 0) {
        try {
          const definitionsDicio = dicio_definicion.definition.map((def: String) => {
            return def;
          });
          console.log(dicio_definicion.definition);

          const examplesDicio = definitionDicio.example.map((example: String) => {
            return "<i>" + example + "</i> ";
          });
          console.log(dicio_definicion.example);

          results.push({
            type: "Article",
            id: "Dicio" + results.length,
            title: "Dicio",
            thumb_url: "https://www.dicio.com.br/favicon-96x96.png",
            description: dicio_definicion.word.toUpperCase() + " " + dicio_definicion.definition[0],
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
