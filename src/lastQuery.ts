import { Language, languageOptions } from "./queries";

const firstLanguage = languageOptions[0].value;

type LastQuery = {
  text: string;
  language: Language;
};

const LOCAL_STORAGE_KEY = "LAST_QUERY";

function getCachedLastQuery(): LastQuery | null {
  const rawLastQuery = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (rawLastQuery) {
    return JSON.parse(rawLastQuery);
  }
  return null;
}

function cacheLastQuery(query: LastQuery): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(query));
}

const defaultQuery = {
  text: "g.V().all()",
  language: firstLanguage
};

let lastQuery: LastQuery = getCachedLastQuery() || defaultQuery;

export function getLastQuery(): LastQuery {
  return lastQuery;
}

export function setLastQuery(query: LastQuery): void {
  lastQuery = query;
  cacheLastQuery(query);
}
