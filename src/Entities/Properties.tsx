import React, { Fragment } from "react";
import {
  Entity as EntityData,
  RDFS_LABEL,
  RDFS_COMMENT,
  RDF_TYPE
} from "./data";
import PropertyName from "./PropertyName";
import Value from "./Value";

type Props = {
  data: EntityData;
  noSingleType?: boolean;
};

const Properties = ({ data, noSingleType }: Props) => {
  return (
    <>
      {Object.entries(data).map(([propertyID, property]) => {
        const values = property.values;
        if (
          // For single labels there's no need to render as they are visible in EntityTitle
          (propertyID === RDFS_LABEL && values.length === 1) ||
          // Comments are rendered separately
          propertyID === RDFS_COMMENT ||
          // If noSingleType is set to true hide single Type properties
          (noSingleType && propertyID === "@type" && values.length === 1)
        ) {
          return null;
        }
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
