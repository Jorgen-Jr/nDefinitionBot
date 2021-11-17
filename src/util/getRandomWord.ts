import fetch, { Response } from "node-fetch";

import $ from "cheerio";

const url = "https://randomword.com/";

export default async (): Promise<string | undefined> => {
  return await fetch(url)
    .then(async (response: Response) => {
      const html = await response.text();

      const word = await $("#random_word", html).text();

      console.log("Random word found: " + word);

      return word;
    })
    .catch((error) => {
      console.log(error);
      return undefined;
    });
};
