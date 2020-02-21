import React from "react";
import { Entity as EntityData } from "./data";
import EntityTitle from "./EntityTitle";
import EntityComment from "./EntityComment";
import EntityID from "./EntityID";
import Properties from "./Properties";
import Instances from "./Instances";
import SubClasses from "./SubClasses";

type Props = {
  serverURL: string;
  onError: (error: Error) => void;
  id: string;
  data: EntityData;
};

/**
 * @todo show super classes in the bottom with a special view
 * @todo show properties with domain of class
 */

const Class = ({ serverURL, onError, id, data }: Props) => {
  return (
    <div className="Entity">
      <EntityTitle id={id} data={data} type="Class" />
      <EntityComment data={data} />
      <EntityID id={id} />
      <Properties data={data} noSingleType />
      <SubClasses serverURL={serverURL} classID={id} onError={onError} />
      <Instances serverURL={serverURL} classID={id} onError={onError} />
    </div>
  );
};

export default Class;
