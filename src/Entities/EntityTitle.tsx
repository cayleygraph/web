import React from "react";
import { Entity as EntityData, RDFS_LABEL } from "./data";
import EntityValue from "./EntityValue";
import { idToDisplay } from "./ID";
import "./EntityTitle.css";

type Props = {
  id: string;
  type: string;
  data: EntityData;
};

const EntityTitle = ({ id, type, data }: Props) => {
  const text = getText(id, data);
  return (
    <div className="EntityTitle">
      <span className="type">{type}</span>
      <h1>
        {text.map((record, i) => (
          <EntityValue key={i} value={record.value} />
        ))}
      </h1>
    </div>
  );
};

export default EntityTitle;

function getText(id: string, data: EntityData): Array<{ value: any }> {
  const labels = data[RDFS_LABEL]?.values;
  if (!labels) {
    return [{ value: idToDisplay(id) }];
  }
  return labels;
}
