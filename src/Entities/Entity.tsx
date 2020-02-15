import React from "react";
import { Entity as EntityData, RDFS_LABEL } from "./data";
import Properties from "./Properties";
import Value from "./Value";

type Props = {
  data: EntityData;
};

const Entity = ({ data }: Props) => {
  const labels = data[RDFS_LABEL]?.values || [];
  return (
    <div className="Entity">
      <h1>
        {labels.map((record, i) => (
          <Value key={i} value={record.value} />
        ))}
      </h1>
      <Properties data={data} />
    </div>
  );
};

export default Entity;
