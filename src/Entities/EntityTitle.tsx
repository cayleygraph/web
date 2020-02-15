import React from "react";
import { Entity as EntityData, RDFS_LABEL } from "./data";
import Value from "./Value";

type Props = {
  data: EntityData;
};

const EntityTitle = ({ data }: Props) => {
  const labels = data[RDFS_LABEL]?.values || [];
  return (
    <h1>
      {labels.map((record, i) => (
        <Value key={i} value={record.value} />
      ))}
    </h1>
  );
};

export default EntityTitle;
