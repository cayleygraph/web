import React, { useState, useEffect } from "react";

import {
  getEntity,
  Entity as EntityData,
  RDFS_CLASS,
  RDF_PROPERTY
} from "./data";
import Entity from "./Entity";
import Class from "./Class";
import Property from "./Property";
import NotFound from "./NotFound";

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
  if (isProperty(result)) {
    return <Property id={entityID} data={result} />;
  }
  if (isClass(result)) {
    return <Class serverURL={serverURL} id={entityID} data={result} />;
  }
  return <Entity id={entityID} data={result} />;
};

export default EntityPage;

function hasType(result: EntityData, type: string) {
  const types = result["@type"]?.values || [];
  return types.some(
    record =>
      typeof record.value === "object" &&
      "@id" in record.value &&
      record.value["@id"] === type
  );
}

function isClass(result: EntityData): boolean {
  return hasType(result, RDFS_CLASS);
}

function isProperty(result: EntityData): boolean {
  return hasType(result, RDF_PROPERTY);
}
