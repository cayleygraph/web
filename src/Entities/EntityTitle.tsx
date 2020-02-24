import React, { useRef, useEffect } from "react";
import {
  Entity as EntityData,
  labelPropertyID,
  LabeledEntityValue
} from "./data";
import EntityValue from "./EntityValue";
import { idToDisplay } from "./ID";
import "./EntityTitle.css";

type Props = {
  id: string;
  type: string;
  data: EntityData;
};

const EntityTitle = ({ id, type, data }: Props) => {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const text = getText(id, data);

  // Autofocus heading
  useEffect(() => {
    headingRef.current?.focus();
  }, [headingRef]);

  return (
    <div className="EntityTitle">
      <span className="type">{type}</span>
      {/* @ts-ignore */}
      <h1 ref={headingRef} tabIndex={0}>
        {text.map((record, i) => (
          <EntityValue key={i} value={record.value} />
        ))}
      </h1>
    </div>
  );
};

export default EntityTitle;

function getText(id: string, data: EntityData): Array<{ value: any }> {
  const labels = data[labelPropertyID]?.values;
  if (!labels) {
    return [{ value: idToDisplay(id) }];
  }
  return labels.filter(
    (record): record is LabeledEntityValue => !Array.isArray(record)
  );
}
