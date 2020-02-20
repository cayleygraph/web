import React from "react";
import ForceGraph from "./ForceGraph";

type GraphData = {
  nodes: { id: string }[];
  links: { source: string; target: string }[];
};

type Result = Array<{ source?: { "@id": string }; target?: { "@id": string } }>;

const resultToGraph = (result: Result): GraphData => {
  const links = [];
  const nodes = new Set();
  for (const row of result) {
    const { source: sourceObject, target: targetObject } = row;
    if (!sourceObject || !targetObject) {
      continue;
    }
    const source = sourceObject["@id"];
    const target = targetObject["@id"];
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

type Props = {
  height: number;
  width: number;
  value:
    | null
    | { error: string }
    | {
        result: Result | null;
      };
};

const Visualize = ({ value, height, width }: Props) => {
  return value && "result" in value && value.result !== null ? (
    <ForceGraph
      data={resultToGraph(value.result)}
      nodeComponent={Node}
      linkComponent={Link}
      height={height}
      width={width}
    />
  ) : null;
};

export default Visualize;
