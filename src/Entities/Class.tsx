import React, { useCallback } from "react";
import {
  Entity as EntityData,
  getSubClasses,
  getInstancesPage,
  getSuperClasses,
  subClassOfPropertyID,
} from "./data";
import EntityTitle from "./EntityTitle";
import EntityComment from "./EntityComment";
import EntityID from "./EntityID";
import Properties from "./Properties";
import EntityList from "./EntityList";
import InstanceProperties from "./InstanceProperties";
import ClassList from "./ClassList";

type Props = {
  serverURL: string;
  onError: (error: Error) => void;
  id: string;
  data: EntityData;
};

const INSTANCES_PAGE_SIZE = 5;

const EXCLUDED_PROPERTIES = new Set([subClassOfPropertyID]);

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
  const instancesQuery = useCallback(
    (query: string, pageNumber: number, pageSize: number) => {
      return getInstancesPage(serverURL, id, query, pageNumber, pageSize);
    },
    [serverURL, id]
  );

  return (
    <div className="Entity">
      <EntityTitle id={id} data={data} type="Class" />
      <EntityComment data={data} />
      <EntityID id={id} />
      <Properties data={data} noSingleType excluding={EXCLUDED_PROPERTIES} />
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
      <EntityList
        title="Instances"
        searchEntities={instancesQuery}
        onError={onError}
        pageSize={INSTANCES_PAGE_SIZE}
      />
    </div>
  );
};

export default Class;
