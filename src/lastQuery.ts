import { Language, languageOptions } from "./queries";

const firstLanguage = languageOptions[0].value;

type LastQuery = {
  text: string;
  language: Language;
};

let lastQuery: LastQuery = {
  text: "",
  language: firstLanguage
};

export function getLastQuery(): LastQuery {
  return lastQuery;
}

export function setLastQuery(query: LastQuery): void {
  lastQuery = query;
}
