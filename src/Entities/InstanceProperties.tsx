import React, { useEffect, useState } from "react";
import { getClassInstanceProperties, ClassInstanceProperty } from "./data";
import ID from "./ID";

type Props = {
  serverURL: string;
  id: string;
  onError: (error: Error) => void;
};

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
          <div className="Property">
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
