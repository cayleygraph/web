import React, { useCallback } from "react";
import {
  Entity as EntityData,
  getSubClassesPage,
  getInstancesPage
} from "./data";
import EntityTitle from "./EntityTitle";
import EntityComment from "./EntityComment";
import EntityID from "./EntityID";
import Properties from "./Properties";
import EntityList from "./EntityList";

type Props = {
  serverURL: string;
  onError: (error: Error) => void;
  id: string;
  data: EntityData;
};

const SUB_CLASSES_PAGE_SIZE = 10;
const INSTANCES_PAGE_SIZE = 10;

/**
 * @todo show super classes in the bottom with a special view
 * @todo show properties with domain of class
 */

const Class = ({ serverURL, onError, id, data }: Props) => {
  const subClassesQuery = useCallback(
    (pageNumber, pageSize) => {
      return getSubClassesPage(serverURL, id, pageNumber, pageSize);
    },
    [serverURL, id]
  );
  const instancesQuery = useCallback(
    (pageNumber, pageSize) => {
      return getInstancesPage(serverURL, id, pageNumber, pageSize);
    },
    [serverURL, id]
  );
  return (
    <div className="Entity">
      <EntityTitle id={id} data={data} type="Class" />
      <EntityComment data={data} />
      <EntityID id={id} />
      <Properties data={data} noSingleType />
      <EntityList
        title="Sub Classes"
        query={subClassesQuery}
        onError={onError}
        pageSize={SUB_CLASSES_PAGE_SIZE}
      />
      <EntityList
        title="Instances"
        query={instancesQuery}
        onError={onError}
        pageSize={INSTANCES_PAGE_SIZE}
      />
    </div>
  );
};

export default Class;
