import React from "react";
import QueryEditor from "./QueryEditor";

type Props = { serverURL: string };

const QueryShapePage = ({ serverURL }: Props) => {
  return (
    <main>
      <QueryEditor onRun={(...args) => console.log("Query Shape", ...args)} />
    </main>
  );
};

export default QueryShapePage;
