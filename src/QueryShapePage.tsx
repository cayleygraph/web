import React, { useCallback, useState } from "react";
import QueryEditor from "./QueryEditor";
import JSONCodeViewer from "./JSONCodeViewer";

type Props = { serverURL: string };

async function getShape(serverURL: string, query: string) {
  const res = await fetch(`${serverURL}/api/v1/shape/gizmo`, {
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
    query => {
      getShape(serverURL, query).then(setResult);
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
