import React, { useCallback, useState } from "react";
import QueryEditor from "./QueryEditor";
import JSONCodeViewer from "./JSONCodeViewer";

type Props = {
  serverURL: string;
};

async function getShape(serverURL: string, language: string, query: string) {
  const res = await fetch(`${serverURL}/api/v1/shape/${language}`, {
    method: "POST",
    body: query
  });
  const { error, ...result } = await res.json();
  if (error) {
    throw new Error(error);
  }
  return result;
}

const QueryShapePage = ({ serverURL }: Props) => {
  const [result, setResult] = useState<object | null>(null);
  const run = useCallback(
    (query, language) => {
      getShape(serverURL, language, query).then(setResult);
    },
    [serverURL]
  );
  return (
    <main>
      <QueryEditor onRun={run} />
      <JSONCodeViewer value={result} />
    </main>
  );
};

export default QueryShapePage;
