import React, { Fragment } from "react";
import { Entity as EntityData, RDFS_LABEL, commentPropertyID } from "./data";
import PropertyName from "./PropertyName";
import EntityValue from "./EntityValue";

type Props = {
  data: EntityData;
  noSingleType?: boolean;
  excluding?: Set<string>;
};

const Properties = ({ data, noSingleType, excluding }: Props) => {
  return (
    <>
      {Object.entries(data).map(([propertyID, property]) => {
        const values = property.values;
        if (
          // Skip excluded properties
          (excluding && excluding.has(propertyID)) ||
          // For single labels there's no need to render as they are visible in EntityTitle
          (propertyID === RDFS_LABEL && values.length === 1) ||
          // Comments are rendered separately
          propertyID === commentPropertyID ||
          // If noSingleType is set to true hide single Type properties
          (noSingleType && propertyID === "@type" && values.length === 1)
        ) {
          return null;
        }
        const valueNodes = values.map((record, i) => {
          if (Array.isArray(record)) {
            return (
              <ol>
                {record.map(item => {
                  return (
                    <li>
                      <EntityValue
                        key={i}
                        value={item.value}
                        label={item.label}
                      />
                    </li>
                  );
                })}
              </ol>
            );
          }
          const suffix = i === values.length - 1 ? null : ", ";
          return (
            <Fragment key={i}>
              <EntityValue key={i} value={record.value} label={record.label} />
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
