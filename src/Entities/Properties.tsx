import React, { Fragment } from "react";
import {
  Entity as EntityData,
  labelPropertyID,
  commentPropertyID,
  EntityProperty,
} from "./data";
import EntityValue from "./EntityValue";
import ID, { getRenderInfo } from "./ID";
import sortBy from "lodash.sortby";

/**
 * Empty set of values will match to all values
 */
export type Excluded = { [property: string]: Set<string> };

type Props = {
  data: EntityData;
  excluding?: Excluded;
};

const Properties = ({ data, excluding }: Props) => {
  const entries = Object.entries(data);
  const mapped = entries.map(
    ([propertyId, property]: [string, EntityProperty]): [
      string,
      EntityProperty
    ] => {
      if (excluding && propertyId in excluding) {
        const excludedIDs = excluding[propertyId];
        const values =
          excludedIDs.size === 0
            ? []
            : property.values.filter(
                (record) =>
                  Array.isArray(record) ||
                  typeof record.value !== "object" ||
                  !("@id" in record.value) ||
                  !excludedIDs.has(record.value["@id"])
              );
        return [
          propertyId,
          {
            ...property,
            values,
          },
        ];
      }
      return [propertyId, property];
    }
  );
  const filtered = mapped.filter(
    ([propertyID, property]) =>
      !(
        // Skip excluded properties
        (
          property.values.length === 0 ||
          // For single labels there's no need to render as they are visible in EntityTitle
          (propertyID === labelPropertyID && property.values.length === 1) ||
          // Comments are rendered separately
          propertyID === commentPropertyID
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
                {record.map((item) => {
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
