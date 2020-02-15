import React, { useState, useEffect } from "react";

import {
  getEntity,
  Entity as EntityData,
  isClass,
  isProperty,
  isReference
} from "./data";
import Entity from "./Entity";
import Class from "./Class";
import Property from "./Property";
import NotFound from "./NotFound";
import useEntityID from "./useEntityID";

type Props = {
  serverURL: string;
  onError: (error: Error | null) => void;
  error: Error | null;
};

const EntityPage = ({ serverURL, onError, error }: Props) => {
  const [result, setResult] = useState<EntityData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const entityID = useEntityID();

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
  if (!entityID) {
    return null;
  }
  if (error) {
    return null;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  if (result === null) {
    return <NotFound id={entityID} />;
  }
  if (hasPropertyType(result)) {
    return <Property id={entityID} data={result} />;
  }
  if (hasClassType(result)) {
    return (
      <Class
        serverURL={serverURL}
        onError={onError}
        id={entityID}
        data={result}
      />
    );
  }
  return <Entity id={entityID} data={result} />;
};

export default EntityPage;

function getTypeIDs(result: EntityData): Set<string> {
  const types = result["@type"]?.values || [];
  return new Set(
    types
      .map(record => record.value)
      .filter(isReference)
      .map(value => value["@id"])
  );
}

function hasClassType(result: EntityData): boolean {
  return isClass(getTypeIDs(result));
}

function hasPropertyType(result: EntityData): boolean {
  return isProperty(getTypeIDs(result));
}
