import React, { useCallback } from "react";
import {
  Entity as EntityData,
  getSubClasses,
  getSuperClasses,
  subClassOfPropertyID,
} from "./data";
import EntityTitle from "./EntityTitle";
import EntityComment from "./EntityComment";
import EntityID from "./EntityID";
import Properties, { Excluded } from "./Properties";
import Instances from "./Instances";
import InstanceProperties from "./InstanceProperties";
import ClassList from "./ClassList";
import { RDFS_CLASS, OWL_CLASS } from "./constants";

type Props = {
  serverURL: string;
  onError: (error: Error) => void;
  id: string;
  data: EntityData;
};

const INSTANCES_PAGE_SIZE = 15;

const EXCLUDED: Excluded = {
  [subClassOfPropertyID]: new Set(),
  "@type": new Set([RDFS_CLASS, OWL_CLASS]),
};

/**
 * @todo show restrictions
 */

const Class = ({ serverURL, onError, id, data }: Props) => {
  const subClassesQuery = useCallback(() => {
    return getSubClasses(serverURL, id);
  }, [serverURL, id]);
  const superClassesQuery = useCallback(() => {
    return getSuperClasses(serverURL, id);
  }, [serverURL, id]);

  return (
    <div className="Entity">
      <EntityTitle id={id} data={data} type="Class" />
      <EntityComment data={data} />
      <EntityID id={id} />
      <Properties data={data} excluding={EXCLUDED} />
      <InstanceProperties serverURL={serverURL} id={id} onError={onError} />
      <ClassList
        title="Super Classes"
        query={superClassesQuery}
        onError={onError}
      />
      <ClassList
        title="Sub Classes"
        query={subClassesQuery}
        onError={onError}
      />
      <Instances
        serverURL={serverURL}
        id={id}
        onError={onError}
        pageSize={INSTANCES_PAGE_SIZE}
      />
    </div>
  );
};

export default Class;
