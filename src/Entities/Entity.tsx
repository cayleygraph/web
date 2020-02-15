import React from "react";
import { Entity as EntityData } from "./data";
import EntityTitle from "./EntityTitle";
import EntityComment from "./EntityComment";
import EntityID from "./EntityID";
import Properties from "./Properties";

type Props = {
  id: string;
  data: EntityData;
};

const Entity = ({ id, data }: Props) => {
  return (
    <div className="Entity">
      <EntityTitle id={id} data={data} type="Entity" />
      <EntityComment data={data} />
      <EntityID id={id} />
      <Properties data={data} />
    </div>
  );
};

export default Entity;
