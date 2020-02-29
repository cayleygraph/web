/**
 * Service holding query history
 */

import { useState, useCallback } from "react";
import { Query, QueryResult, Language } from "./queries";

type AddQuery = (query: { text: string; language: Language }) => number;
type SetResult = (id: number, result: QueryResult) => void;

export default function useQueryHistory(): [Query[], AddQuery, SetResult] {
  let [history, setHistory] = useState<Query[]>([]);

  const add = useCallback(
    query => {
      const id = history.length;
      setHistory([
        ...history,
        { ...query, id, result: null, time: new Date() }
      ]);
      return id;
    },
    [history, setHistory]
  );

  const setResult = useCallback(
    (id, result) => {
      setHistory(history =>
        history.map(query => {
          if (query.id !== id) {
            return query;
          }
          return { ...query, result };
        })
      );
    },
    [setHistory]
  );

  return [history, add, setResult];
}
