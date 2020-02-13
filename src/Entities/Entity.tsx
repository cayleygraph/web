import React, { Fragment, useState, useEffect } from "react";
import Value from "./Value";
import PropertyName from "./PropertyName";
import { getEntity, EntityValueRecord, Entity as EntityData } from "./data";

type Props = {
  entityID: string;
  serverURL: string;
  onError: (error: Error | null) => void;
  error: Error | null;
};

const Entity = ({ entityID, serverURL, onError, error }: Props) => {
  const [result, setResult] = useState<EntityData | null>(null);
  useEffect(() => {
    onError(null);
    setResult(null);
    if (entityID) {
      getEntity(serverURL, entityID)
        .then(result => {
          setResult(result);
        })
        .catch(error => {
          onError(error);
        });
    }
  }, [entityID, serverURL, setResult, onError]);
  if (error) {
    return null;
  }
  if (result === null) {
    return <div>Loading...</div>;
  }
  return (
    <Fragment>
      {Object.entries(result).map(([property, values]) => {
        if (!Array.isArray(values)) {
          throw new Error("Unexpected type of values");
        }
        const valueNodes = values.map((record: EntityValueRecord, i) => {
          const suffix = i === values.length - 1 ? null : ", ";
          return (
            <Fragment key={i}>
              <Value key={i} value={record.value} label={record.label} />
              {suffix}
            </Fragment>
          );
        });
        return (
          <li key={property}>
            <PropertyName property={property} />: {valueNodes}
          </li>
        );
      })}
    </Fragment>
  );
};

export default Entity;
