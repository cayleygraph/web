import React, { useCallback, useState } from "react";
import QueryEditor from "./QueryEditor";
import ForceGraph from "./ForceGraph";
import { runQuery, QueryResult } from "./queries";
import "./VisualizePage.css";

type Props = {
  serverURL: string;
};

type GraphData = {
  nodes: { id: string }[];
  links: { source: string; target: string }[];
};

const resultToGraph = (
  result: Array<{ source: { "@id": string }; target: { "@id": string } }>
): GraphData => {
  const links = [];
  const nodes = new Set();
  for (const row of result) {
    if (!("source" in row) || !("target" in row)) {
      continue;
    }
    const {
      source: { "@id": source },
      target: { "@id": target }
    } = row;
    nodes.add(source);
    nodes.add(target);
    links.push({ source, target });
  }
  // @ts-ignore
  return { links, nodes: [...nodes.values()].map(id => ({ id })) };
};

const Link = ({
  link
}: {
  link: {
    id: string;
    source: { x: number; y: number };
    target: { x: number; y: number };
  };
}) => (
  <line
    x1={link.source.x}
    y1={link.source.y}
    x2={link.target.x}
    y2={link.target.y}
    strokeWidth={2}
    stroke="#999"
    strokeOpacity={0.6}
  >
    <text>{link.id}</text>
  </line>
);

const Node = ({ node }: { node: { id: string } }) => (
  <g>
    <circle r={5} fill="#21D4FD" />
    <text textAnchor="end">{node.id}</text>
  </g>
);

const VisualizePage = ({ serverURL }: Props) => {
  const [result, setResult] = useState<QueryResult>(null);
  const handleRun = useCallback(
    (query, language, onDone) => {
      runQuery(serverURL, language, query).then(result => {
        setResult(result);
      }).finally(onDone);
    },
    [serverURL]
  );
  return (
    <main>
      <QueryEditor onRun={handleRun} />
      {result && "result" in result ? (
        <ForceGraph
          data={resultToGraph(result.result)}
          nodeComponent={Node}
          linkComponent={Link}
        />
      ) : null}
    </main>
  );
};

export default VisualizePage;
