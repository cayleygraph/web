import React from "react";
import { Entity as EntityData, commentPropertyID } from "./data";
import EntityValue from "./EntityValue";

type Props = {
  data: EntityData;
};

const EntityComment = ({ data }: Props) => {
  const comments = data[commentPropertyID]?.values || [];
  return (
    <>
      {comments.map(record => {
        if (Array.isArray(record)) {
          return null;
        }
        return (
          <p>
            <EntityValue value={record.value} />
          </p>
        );
      })}
    </>
  );
};

export default EntityComment;
