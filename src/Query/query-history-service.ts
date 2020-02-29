/**
 * Service holding query history
 * Persists to local storage
 * @todo Make events to be independent of current state
 * @todo Use append only storage to reduce read
 * @todo Cache to memory when listening to full state
 */

import * as uuid from "uuid";
import { EventEmitter } from "events";
import { useState, useEffect } from "react";
import { Query, QueryResult, Language } from "../queries";

const LOCAL_STORAGE_ITEM = "QUERY_HISTORY";
export const eventEmitter = new EventEmitter();

export const add = (query: { text: string; language: Language }): string => {
  const id = createID();
  console.debug(
    `[Query History] Add query ${id}:\n\tlanguage: ${query.language}\n\ttext: ${query.text}`
  );
  eventEmitter.emit("create", {
    ...query,
    id,
    result: null,
    time: new Date()
  });
  return id;
};

export const setResult = (id: string, result: QueryResult): void => {
  console.debug(`[Query History] Set result for ${id}`);
  eventEmitter.emit("update", id, { result });
};

export function startTracking(): void {
  console.debug("[Query History] Tracking...");
  eventEmitter.addListener("create", create);
  eventEmitter.addListener("update", update);
  eventEmitter.addListener("change", set);
}

export function stopTracking(): void {
  console.debug("[Query History] Stopped tracking");
  eventEmitter.removeListener("create", create);
  eventEmitter.removeListener("update", update);
  eventEmitter.removeListener("change", set);
}

function createID(): string {
  return uuid.v4();
}

function get(): Query[] {
  return getFromStorage();
}

function set(history: Query[]) {
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

function create(query: Query) {
  const history = get();
  history.push(query);
  eventEmitter.emit("change", history);
}

function update(id: string, partial: Partial<Query>) {
  const history = get();
  const query = history.find(query => query.id === id);
  Object.assign(query, partial);
  eventEmitter.emit("change", history);
}

// React hooks

export function useQueryHistoryTracking() {
  useEffect(() => {
    startTracking();
    return stopTracking;
  }, []);
}

export function useQueryHistory(): Query[] {
  const [history, setHistory] = useState<Query[]>(get());
  useEffect(() => {
    eventEmitter.addListener("change", setHistory);
    return () => {
      eventEmitter.removeListener("change", setHistory);
    };
  }, [setHistory]);
  return history;
}
