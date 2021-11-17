export type query = {
  id: string;
  from?: any;
  location?: any;
  query: string;
  offset?: string;
};

export type Definition = {
  word: string;
  definition: DefinitionObject;
  source: string;
  synonyms?: string[];
  examples?: string[];
  antonyms?: string[];
};

export type DefinitionObject = {
  index?: number;
  category?: string;
  definition?: string | { definition: string; index: number }[];
  definitions?: { definition: string; index: string }[];
};

export type InlineQueryResult = TelegramBot.InlineQueryResult;

export type InlineQueryResultArticle = {
  type: string;
  id: string;
  title: string;
  input_message_content: InputTextMessageContent;
  reply_markup?: any;
  url?: string;
  hide_url?: boolean;
  description?: string;
  thumb_url?: string;
  thumb_width?: number;
  thumb_height?: number;
};

export type InputTextMessageContent = {
  message_text: string;
  parse_mode?: "HTML" | "MarkdownV2" | "Markdown";
  disable_web_page_preview?: boolean;
};
