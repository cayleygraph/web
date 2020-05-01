import React from "react";
import { Entity as EntityData } from "./data";
import EntityTitle from "./EntityTitle";
import EntityComment from "./EntityComment";
import EntityID from "./EntityID";
import Properties, { Excluded } from "./Properties";
import { RDFS_DATATYPE } from "./constants";

type Props = {
  id: string;
  data: EntityData;
};

const EXCLUDED: Excluded = {
  "@type": new Set([RDFS_DATATYPE]),
};

const Datatype = ({ id, data }: Props) => {
  return (
    <div className="Entity">
      <EntityTitle id={id} data={data} type="Datatype" />
      <EntityComment data={data} />
      <EntityID id={id} />
      <Properties data={data} excluding={EXCLUDED} />
    </div>
  );
};

export default Datatype;
