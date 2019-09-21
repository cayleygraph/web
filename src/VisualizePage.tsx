import React from "react";
import QueryEditor from "./QueryEditor";

type Props = { serverURL: string };

const VisualizePage = ({ serverURL }: Props) => {
  return (
    <main>
      <QueryEditor onRun={(...args) => console.log("Visualize", ...args)} />
    </main>
  );
};

export default VisualizePage;
