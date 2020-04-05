import React, { useCallback } from "react";
import {
  Entity as EntityData,
  getSubClassesPage,
  getInstancesPage,
  getSuperClassesPage,
  subClassOfPropertyID,
} from "./data";
import EntityTitle from "./EntityTitle";
import EntityComment from "./EntityComment";
import EntityID from "./EntityID";
import Properties from "./Properties";
import EntityList from "./EntityList";
import InstanceProperties from "./InstanceProperties";

type Props = {
  serverURL: string;
  onError: (error: Error) => void;
  id: string;
  data: EntityData;
};

const SUPER_CLASSES_PAGE_SIZE = 5;
const SUB_CLASSES_PAGE_SIZE = 5;
const INSTANCES_PAGE_SIZE = 5;

const EXCLUDED_PROPERTIES = new Set([subClassOfPropertyID]);

/**
 * @todo show restrictions
 */

const Class = ({ serverURL, onError, id, data }: Props) => {
  const subClassesQuery = useCallback(
    (query: string, pageNumber: number, pageSize: number) => {
      return getSubClassesPage(serverURL, id, query, pageNumber, pageSize);
    },
    [serverURL, id]
  );
  const instancesQuery = useCallback(
    (query: string, pageNumber: number, pageSize: number) => {
      return getInstancesPage(serverURL, id, query, pageNumber, pageSize);
    },
    [serverURL, id]
  );
  const superClassesQuery = useCallback(
    (query: string, pageNumber: number, pageSize: number) => {
      return getSuperClassesPage(serverURL, id, query, pageNumber, pageSize);
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
      <EntityList
        title="Super Classes"
        searchEntities={superClassesQuery}
        onError={onError}
        pageSize={SUPER_CLASSES_PAGE_SIZE}
      />
      <EntityList
        title="Sub Classes"
        searchEntities={subClassesQuery}
        onError={onError}
        pageSize={SUB_CLASSES_PAGE_SIZE}
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
