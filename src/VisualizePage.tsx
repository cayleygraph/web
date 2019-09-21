import React, { useCallback, useState, useEffect } from "react";
import QueryEditor from "./QueryEditor";
import ForceGraph from "./ForceGraph";
import { runQuery, QueryResult } from "./queries";
import "./VisualizePage.css";

type Props = { serverURL: string };

type GraphData = {
  nodes: { id: string }[];
  links: { source: string; target: string }[];
};

const resultToGraph = (
  result: Array<{ source: string; target: string }>
): GraphData => {
  const links = [];
  const nodes = new Set();
  for (const row of result) {
    const { source, target } = row;
    nodes.add(source);
    nodes.add(target);
    links.push({ source, target });
  }
  return { links, nodes: [...nodes.values()].map(id => ({ id })) };
};

const INITIAL_GRAPH_DATA_STATE: GraphData = { nodes: [], links: [] };

const Link = ({ link }) => (
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

const Node = ({ node }) => (
  <g>
    <circle r={5} fill="#21D4FD" />
    <text textAnchor="end">{node.id}</text>
  </g>
);

const VisualizePage = ({ serverURL }: Props) => {
  const [result, setResult] = useState<QueryResult>(null);
  const handleRun = useCallback(
    (query, language) => {
      runQuery(serverURL, language, query).then(result => {
        setResult(result);
      });
    },
    [serverURL]
  );
  return (
    <main>
      <QueryEditor onRun={handleRun} />
      <ForceGraph
        data={
          result && "result" in result ? resultToGraph(result.result) : null
        }
        nodeComponent={Node}
        linkComponent={Link}
      />
    </main>
  );
};

export default VisualizePage;
