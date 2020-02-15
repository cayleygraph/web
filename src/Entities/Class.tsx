import React from "react";
import { Entity as EntityData } from "./data";
import EntityTitle from "./EntityTitle";
import EntityComment from "./EntityComment";
import EntityID from "./EntityID";
import Properties from "./Properties";
import Instances from "./Instances";

type Props = {
  serverURL: string;
  id: string;
  data: EntityData;
};

const Class = ({ serverURL, id, data }: Props) => {
  return (
    <div className="Entity">
      <div className="TopicTitle">
        <span className="EntityType">Class</span>
        <EntityTitle data={data} />
      </div>
      <EntityComment data={data} />
      <EntityID id={id} />
      <Properties data={data} />
      <Instances serverURL={serverURL} classID={id} />
    </div>
  );
};

export default Class;
