import React, { useEffect, useState } from "react";
import { getClassInstanceProperties, ClassInstanceProperty } from "./data";
import ID from "./ID";

type Props = {
  serverURL: string;
  id: string;
  onError: (error: Error) => void;
};

/**
 * @todo display restrictions
 * @todo order properties by title
 */
const InstanceProperties = ({ serverURL, id, onError }: Props) => {
  const [instanceProperties, setInstanceProperties] = useState<
    ClassInstanceProperty[]
  >([]);
  useEffect(() => {
    getClassInstanceProperties(serverURL, id)
      .then(setInstanceProperties)
      .catch(onError);
  }, [serverURL, id, setInstanceProperties, onError]);
  return (
    <>
      <h3>Instance Properties</h3>
      {instanceProperties.length === 0 && "No instance properties found"}
      {instanceProperties.map(property => {
        return (
          <div className="Property" key={property["@id"]}>
            <b>
              <ID id={property["@id"]} label={property.label} />
              {": "}
            </b>

            <ID id={property.range["@id"]} />
          </div>
        );
      })}
    </>
  );
};

export default InstanceProperties;
