import React from "react";
import { Entity as EntityData, RDFS_COMMENT } from "./data";
import EntityValue from "./EntityValue";

type Props = {
  data: EntityData;
};

const EntityComment = ({ data }: Props) => {
  const comments = data[RDFS_COMMENT]?.values || [];
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
