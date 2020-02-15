import React from "react";
import { Entity as EntityData } from "./data";
import EntityTitle from "./EntityTitle";
import Properties from "./Properties";

type Props = {
  data: EntityData;
};

const Entity = ({ data }: Props) => {
  return (
    <div className="Entity">
      <EntityTitle data={data} />
      <Properties data={data} />
    </div>
  );
};

export default Entity;
