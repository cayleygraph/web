import React, { useState, useEffect } from "react";

import { getEntity, Entity as EntityData, RDFS_CLASS } from "./data";
import Entity from "./Entity";
import NotFound from "./NotFound";
import Class from "./Class";

type Props = {
  entityID: string;
  serverURL: string;
  onError: (error: Error | null) => void;
  error: Error | null;
};

const EntityPage = ({ entityID, serverURL, onError, error }: Props) => {
  const [result, setResult] = useState<EntityData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    onError(null);
    setResult(null);
    setLoading(true);
    if (entityID) {
      getEntity(serverURL, entityID)
        .then(result => {
          setResult(result);
        })
        .catch(error => {
          onError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [entityID, serverURL, setResult, onError]);
  if (error) {
    return null;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  if (result === null) {
    return <NotFound />;
  }
  if (isClass(result)) {
    return <Class data={result} />;
  }
  return <Entity data={result} />;
};

export default EntityPage;

function isClass(result: EntityData): boolean {
  const types = result["@type"]?.values || [];
  return types.some(
    record =>
      typeof record.value === "object" &&
      "@id" in record.value &&
      record.value["@id"] === RDFS_CLASS
  );
}
