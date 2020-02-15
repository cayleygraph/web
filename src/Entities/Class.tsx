import React from "react";
import { Entity as EntityData } from "./data";
import EntityTitle from "./EntityTitle";
import EntityComment from "./EntityComment";
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
      <span>Class</span>
      <EntityTitle data={data} />
      <EntityComment data={data} />
      <Properties data={data} />
      <h3>Instances</h3>
      <Instances serverURL={serverURL} classID={id} />
    </div>
  );
};

export default Class;
