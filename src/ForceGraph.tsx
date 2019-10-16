import React, { useState, useEffect } from "react";
import { Graph } from "@vx/network";
import useDimensions from "react-use-dimensions";
import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation
} from "d3-force";

type GraphData = {
  nodes: { id: string }[];
  links: { source: string; target: string }[];
};

const INITIAL_FORCE_DATA: GraphData = { nodes: [], links: [] };

type Props = {
  data: GraphData;
  linkComponent: any;
  nodeComponent: any;
};

const ForceGraph = ({ data, linkComponent, nodeComponent }: Props) => {
  const [forceData, setForceData] = useState(INITIAL_FORCE_DATA);
  const [ref, { width, height }] = useDimensions();
  useEffect(() => {
    if (data && width && height) {
      // @ts-ignore
      const force = forceSimulation(data.nodes)
        .force(
          "link",
          forceLink()
            // @ts-ignore
            .id(d => d.id)
            .links(data.links)
            .distance(100)
        )
        .force("charge", forceManyBody())
        .force("center", forceCenter(width / 2, height / 2));

      // Force-update the component on each force tick
      force.on("tick", () => {
        setForceData({ ...data });
      });
    }
  }, [data, height, width]);
  return (
    <div className="graph" ref={ref}>
      <svg>
        <Graph
          graph={forceData}
          linkComponent={linkComponent}
          nodeComponent={nodeComponent}
        />
      </svg>
    </div>
  );
};

export default ForceGraph;
