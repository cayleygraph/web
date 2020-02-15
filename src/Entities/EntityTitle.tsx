import React from "react";
import { Entity as EntityData, RDFS_LABEL } from "./data";
import Value from "./Value";
import "./EntityTitle.css";

type Props = {
  type: string;
  data: EntityData;
};

const EntityTitle = ({ type, data }: Props) => {
  const labels = data[RDFS_LABEL]?.values || [];
  return (
    <div className="EntityTitle">
      <span className="type">{type}</span>
      <h1>
        {labels.map((record, i) => (
          <Value key={i} value={record.value} />
        ))}
      </h1>
    </div>
  );
};

export default EntityTitle;
