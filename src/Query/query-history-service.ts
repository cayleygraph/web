/**
 * Service holding query history
 * Persists to local storage
 * @todo Use append only storage to reduce read
 * @todo Cache to memory when listening to full state
 */

import * as uuid from "uuid";
import { EventEmitter } from "events";
import { useState, useEffect } from "react";
import { Query, QueryResult, Language } from "../queries";

const LOCAL_STORAGE_ITEM = "QUERY_HISTORY";
const LOCAL_STORAGE_ACTIVE_QUERY_ID_ITEM = "QUERY_HISTORY_ACTIVE_QUERY_ID";
export const eventEmitter = new EventEmitter();

type AddQueryEvent = {
  id: string;
  text: string;
  language: Language;
  time: Date;
};

type AddResultEvent = {
  id: string;
  result: QueryResult;
};

type History = Array<AddQueryEvent | AddResultEvent>;

export function addQuery(query: { text: string; language: Language }): string {
  const id = createID();
  const event: AddQueryEvent = {
    id,
    time: new Date(),
    ...query
  };
  console.debug(
    `[Query History] Add query ${id}:\n\tlanguage: ${query.language}\n\ttext: ${query.text}`
  );
  eventEmitter.emit("add-query", event);
  return id;
}

export function addResult(id: string, result: QueryResult): void {
  console.debug(`[Query History] Set result for ${id}`);
  const event: AddResultEvent = {
    id,
    result
  };
  eventEmitter.emit("add-result", event);
}

export function startTracking(): void {
  console.debug("[Query History] Tracking...");
  eventEmitter.addListener("add-query", handleAdd);
  eventEmitter.addListener("add-result", handleAdd);
  eventEmitter.addListener("change", set);
}

export function stopTracking(): void {
  console.debug("[Query History] Stopped tracking");
  eventEmitter.removeListener("add-query", handleAdd);
  eventEmitter.removeListener("add-result", handleAdd);
  eventEmitter.removeListener("change", set);
}

export function getActiveQueryID(): string | null {
  return localStorage.getItem(LOCAL_STORAGE_ACTIVE_QUERY_ID_ITEM) || null;
}

export function setActiveQueryID(id: string): void {
  localStorage.setItem(LOCAL_STORAGE_ACTIVE_QUERY_ID_ITEM, id);
}

function createID(): string {
  return uuid.v4();
}

function get(): History {
  return getFromStorage();
}

function set(history: History) {
  localStorage.setItem(LOCAL_STORAGE_ITEM, JSON.stringify(history));
  console.debug("[Query History] Updated storage");
}

function getFromStorage() {
  const serialized = localStorage.getItem(LOCAL_STORAGE_ITEM);
  let rawHistory = serialized ? JSON.parse(serialized) : [];
  const history = rawHistory.map((query: Query) => {
    return {
      ...query,
      time: new Date(query.time)
    };
  });
  console.debug("[Query History] Get from storage", history);
  return history;
}

function handleAdd(event: AddQueryEvent | AddResultEvent) {
  const history = get();
  history.push(event);
  eventEmitter.emit("change", history);
}

function getQueries(): Query[] {
  const history = get();
  const queries: Query[] = [];
  for (const event of history) {
    if ("result" in event) {
      const query = queries.find(query => query.id === event.id);
      if (query) {
        query.result = event.result;
      }
    } else {
      queries.push({ ...event, result: null });
    }
  }
  return queries;
}

function getResult(id: string): QueryResult | null {
  const history = get();
  const existingEvent = history.find(
    event => event.id === id && "result" in event
  ) as AddResultEvent | undefined;
  if (existingEvent) {
    return existingEvent.result;
  }
  return null;
}

function trackResult(
  id: string,
  onChange: (result: QueryResult) => void
): (event: AddResultEvent) => void {
  return (event: AddResultEvent) => {
    if (event.id === id) {
      onChange(event?.result);
    }
  };
}

// React hooks

export function useQueryHistoryTracking() {
  useEffect(() => {
    startTracking();
    return stopTracking;
  }, []);
}

export function useQueryResult(id: string | null): QueryResult | null {
  const [result, setResult] = useState<QueryResult | null>(null);
  useEffect(() => {
    if (id === null) {
      return;
    }
    const existing = getResult(id);
    if (existing) {
      setResult(existing);
    }
    const handler = trackResult(id, setResult);
    eventEmitter.addListener("add-result", handler);
    return () => {
      eventEmitter.removeListener("add-result", handler);
    };
  }, [id]);
  return result;
}

export function useQueryHistory(): Query[] {
  const [history, setHistory] = useState<Query[]>(getQueries());
  useEffect(() => {
    eventEmitter.addListener("change", setHistory);
    return () => {
      eventEmitter.removeListener("change", setHistory);
    };
  }, [setHistory]);
  return history;
}
