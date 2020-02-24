import React, { Fragment } from "react";
import {
  Entity as EntityData,
  labelPropertyID,
  commentPropertyID
} from "./data";
import EntityValue from "./EntityValue";
import ID, { getRenderInfo } from "./ID";
import sortBy from "lodash.sortby";

type Props = {
  data: EntityData;
  noSingleType?: boolean;
  excluding?: Set<string>;
};

const Properties = ({ data, noSingleType, excluding }: Props) => {
  const entries = Object.entries(data);
  const filtered = entries.filter(
    ([propertyID, property]) =>
      !(
        // Skip excluded properties
        (
          (excluding && excluding.has(propertyID)) ||
          // For single labels there's no need to render as they are visible in EntityTitle
          (propertyID === labelPropertyID && property.values.length === 1) ||
          // Comments are rendered separately
          propertyID === commentPropertyID ||
          // If noSingleType is set to true hide single Type properties
          (noSingleType &&
            propertyID === "@type" &&
            property.values.length === 1)
        )
      )
  );
  const sorted = sortBy(
    filtered,
    ([propertyID, property]) => getRenderInfo(propertyID, property.label).label
  );
  return (
    <>
      {sorted.map(([propertyID, property]) => {
        const values = property.values;
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
            <b>
              <ID id={propertyID} label={property.label} />
            </b>
            : {valueNodes}
          </div>
        );
      })}
    </>
  );
};

export default Properties;
