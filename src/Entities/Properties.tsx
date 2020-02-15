import React, { Fragment } from "react";
import { Entity as EntityData } from "./data";
import PropertyName from "./PropertyName";
import Value from "./Value";

type Props = {
  data: EntityData;
};

const Properties = ({ data }: Props) => {
  return (
    <>
      {Object.entries(data).map(([propertyID, property]) => {
        const values = property.values;
        const valueNodes = values.map((record, i) => {
          const suffix = i === values.length - 1 ? null : ", ";
          return (
            <Fragment key={i}>
              <Value key={i} value={record.value} label={record.label} />
              {suffix}
            </Fragment>
          );
        });
        return (
          <div className="Property" key={propertyID}>
            <PropertyName property={propertyID} label={property.label} />:{" "}
            {valueNodes}
          </div>
        );
      })}
    </>
  );
};

export default Properties;
