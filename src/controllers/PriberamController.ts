import thedictapi from "../services/thedictapi";
import { DefinitionObject, InlineQueryResult } from "../types";

export default async (word: string) => {
  let results: InlineQueryResult[] = [];

  const definitionPriberam = await thedictapi.get("/priberam?word=" + word).then((res) => {
    return res.data;
  });

  if (definitionPriberam.definition) {
    if (definitionPriberam.definition.length > 0) {
      try {
        const definitionsPriberam = definitionPriberam.definition.map((def: DefinitionObject) => {
          if (def.index === 0) {
            return "<b><i>" + def.definition + "</i></b>";
          } else {
            return "<b><i>" + def.index + "</i></b> " + def.definition;
          }
        });

        results.push({
          type: "Article",
          id: "Priberam" + results.length,
          title: "Priberam",
          thumb_url: "https://img.ibxk.com.br/2014/2/programas/9695104192743330.png",
          description: definitionPriberam.word + " " + definitionPriberam.definition[0].definition,
          input_message_content: {
            parse_mode: "HTML",
            message_text: "<b><i>" + definitionPriberam.word + "</i></b> \n" + definitionsPriberam.join("\n") + "\n\n",
          },
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Fonte",
                  url: definitionPriberam.source,
                },
              ],
            ],
          },
        });
      } catch (err) {
        console.error("Houston? We have an issue with Priberam:", err);
      }
    }
  }
  return results;
};
