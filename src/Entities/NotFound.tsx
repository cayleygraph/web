import React from "react";
import EntityID from "./EntityID";

type Props = {
  id: string;
};

const NotFound = ({ id }: Props) => {
  return (
    <div className="NotFound">
      <div className="EntityTitle">
        <span className="type">Error</span>
        <h1>
          No entity found{" "}
          <span role="img" aria-label="not found">
            🤷
          </span>{" "}
        </h1>
      </div>

      <EntityID id={id} />
    </div>
  );
};

export default NotFound;
