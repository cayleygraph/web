import React, { useState, useEffect } from "react";
import { Graph } from "@vx/network";
import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  Simulation,
  SimulationNodeDatum
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
  height: number;
  width: number;
};

const ForceGraph = ({
  data,
  linkComponent,
  nodeComponent,
  height,
  width
}: Props) => {
  const [forceData, setForceData] = useState(INITIAL_FORCE_DATA);
  useEffect(() => {
    let force: Simulation<SimulationNodeDatum, undefined> | undefined;
    if (data && width && height) {
      // @ts-ignore
      force = forceSimulation(data.nodes)
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
    }
    if (force) {
      // Force-update the component on each force tick
      force.on("tick", () => {
        setForceData({ ...data });
      });
    }
    return () => {
      if (force) {
        force.stop();
      }
    };
  }, [data, height, width]);
  return (
    <div className="graph">
      <svg height={height} width={width}>
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
