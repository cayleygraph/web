import React, { useCallback, useState, useEffect } from "react";
import QueryEditor from "./QueryEditor";
import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation
} from "d3-force";
import { Graph } from "@vx/network";
import useDimensions from "react-use-dimensions";
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
  const [graphData, setGraphData] = useState(INITIAL_GRAPH_DATA_STATE);
  const [ref, { width, height }] = useDimensions();
  const handleRun = useCallback(
    (query, language) => {
      runQuery(serverURL, language, query).then(result => {
        setResult(result);
      });
    },
    [serverURL]
  );
  useEffect(() => {
    if (result && "result" in result) {
      const data = resultToGraph(result.result);
      const force = forceSimulation(data.nodes)
        .force(
          "link",
          forceLink()
            .id((d: { id: string }) => d.id)
            .links(data.links)
            .distance(100)
        )
        .force("charge", forceManyBody())
        .force("center", forceCenter(width / 2, height / 2));

      // Force-update the component on each force tick
      force.on("tick", () => {
        setGraphData({ ...data });
      });
    }
  }, [result]);
  return (
    <main>
      <QueryEditor onRun={handleRun} />
      <svg className="graph" ref={ref}>
        <Graph graph={graphData} linkComponent={Link} nodeComponent={Node} />
      </svg>
    </main>
  );
};

export default VisualizePage;
