import React from "react";
import { Entity as EntityData } from "./data";
import EntityTitle from "./EntityTitle";
import Properties from "./Properties";

type Props = {
  data: EntityData;
};

const Class = ({ data }: Props) => {
  return (
    <div className="Entity">
      <span>Class</span>
      <EntityTitle data={data} />
      <Properties data={data} />
    </div>
  );
};

export default Class;
