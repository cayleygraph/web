import React from "react";
import { Entity as EntityData, RDFS_COMMENT } from "./data";
import Value from "./Value";

type Props = {
  data: EntityData;
};

const EntityComment = ({ data }: Props) => {
  const comments = data[RDFS_COMMENT]?.values || [];
  return (
    <>
      {comments.map(record => {
        return (
          <p>
            <Value value={record.value} />
          </p>
        );
      })}
    </>
  );
};

export default EntityComment;
