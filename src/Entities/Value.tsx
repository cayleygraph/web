import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  EntityValue,
  Label,
  XSD,
  XSD_STRING,
  isReference,
  RDFS_CLASS
} from "./data";
import { entityLink } from "./navigation";

const Value = ({
  value,
  label,
  Component = Fragment
}: {
  value: EntityValue;
  label?: Label | null | undefined;
  Component?: React.ComponentType;
}) => {
  if (isReference(value)) {
    const id = value["@id"];
    if (id === RDFS_CLASS) {
      return <Component>Class</Component>;
    }
    if (id.startsWith(XSD)) {
      return <Component>{id.substr(XSD.length)}</Component>;
    }
    return (
      <Link to={entityLink(id)}>
        <Component>
          {label ? <Value value={label} label={null} /> : id}
        </Component>
      </Link>
    );
  }
  if (typeof value === "string") {
    return <Component>{value}</Component>;
  }
  if ("@type" in value && value["@type"] === XSD_STRING) {
    return <Component>{value["@value"]}</Component>;
  }
  if ("@language" in value) {
    return (
      <Component>
        {value} {value["@language"]}
      </Component>
    );
  }
  return (
    <Component>
      {value["@value"]} (<Value value={{ "@id": value["@type"] }} />)
    </Component>
  );
};

export default Value;
