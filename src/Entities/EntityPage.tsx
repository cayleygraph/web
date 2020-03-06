import React, { useState, useEffect } from "react";

import {
  getEntity,
  Entity as EntityData,
  isClass,
  isProperty,
  isDatatype,
  LabeledEntityValue
} from "./data";
import * as jsonLd from "./json-ld";
import Entity from "./Entity";
import Class from "./Class";
import Property from "./Property";
import Datatype from "./Datatype";
import NotFound from "./NotFound";
import useEntityID from "./useEntityID";
import { EntityLoading } from "./EntityLoading";

type Props = {
  serverURL: string;
  setError: (error: Error | null) => void;
  error: Error | null;
};

const EntityPage = ({ serverURL, setError, error }: Props) => {
  const [result, setResult] = useState<EntityData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const entityID = useEntityID();

  useEffect(() => {
    setError(null);
    setResult(null);

    if (entityID) {
      setLoading(true);
      getEntity(serverURL, entityID)
        .then(result => {
          setResult(result);
        })
        .catch(error => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [entityID, serverURL, setResult, setError]);
  if (!entityID) {
    return null;
  }
  if (error) {
    return null;
  }
  if (loading) {
    return <EntityLoading />;
  }
  if (result === null) {
    return <NotFound id={entityID} />;
  }
  const typeIDs = getTypeIDs(result);
  if (isProperty(typeIDs)) {
    return <Property id={entityID} data={result} />;
  }
  if (isDatatype(typeIDs)) {
    return <Datatype id={entityID} data={result} />;
  }
  if (isClass(typeIDs)) {
    return (
      <Class
        serverURL={serverURL}
        onError={setError}
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
      .filter((record): record is LabeledEntityValue => !Array.isArray(record))
      .map(record => record.value)
      .filter(jsonLd.isReference)
      .map(value => value["@id"])
  );
}
