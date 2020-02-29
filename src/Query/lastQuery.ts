/**
 * Service for saving and retrieving the last query written
 */

import { Language, languageOptions } from "../queries";

/**
 * Represents the last state of the query editor
 */
export type LastQuery = {
  text: string;
  language: Language;
};

const LOCAL_STORAGE_QUERY_PREFIX = "LAST_QUERY/";
const LOCAL_STORAGE_LANGUAGE = "LANGUAGE";

export function getLastQuery(language?: Language): LastQuery {
  language = language || getLastLanguage();
  console.debug(`[Last Query] last language: ${language}`);
  const query = getCachedLastQuery(language) || getDefaultQuery(language);
  console.debug(`[Last Query] last query for ${language}: ${query?.text}`);
  return query;
}

export function setLastQuery(query: LastQuery): void {
  console.debug(
    `[Last Query] set last query for ${query.language} to:\n${query.text}`
  );
  cacheLanguage(query.language);
  cacheLastQuery(query);
}

function getLastLanguage(): Language {
  return getCachedLanguage() || getDefaultLanguage();
}

function getDefaultLanguage(): Language {
  return languageOptions[0].value;
}

function getDefaultQuery(language: Language): LastQuery {
  return {
    language,
    text: DEFAULT_QUERIES[language]
  };
}

const DEFAULT_QUERIES: { [language in Language]: string } = {
  gizmo: "g.V().all()",
  graphql: `{
    nodes(first: 10){
      id
    }
}`,
  mql: `[{"id": null}]`
};

function getCachedLastQuery(language: Language): LastQuery | null {
  const rawLastQuery = localStorage.getItem(getCacheKey(language));
  if (rawLastQuery) {
    return { language, text: rawLastQuery };
  }
  return null;
}

function getCachedLanguage(): Language | null {
  return (localStorage.getItem(LOCAL_STORAGE_LANGUAGE) as Language) || null;
}

function cacheLastQuery(query: LastQuery): void {
  localStorage.setItem(getCacheKey(query.language), query.text);
}

function cacheLanguage(language: Language): void {
  localStorage.setItem(LOCAL_STORAGE_LANGUAGE, language);
}

function getCacheKey(language: Language): string {
  return [LOCAL_STORAGE_QUERY_PREFIX, language].join("/");
}
