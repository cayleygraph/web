import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { EntityValue, Label, XSD_STRING, isReference } from "./data";
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
    return (
      <Link to={entityLink(value["@id"])}>
        <Component>
          {label ? <Value value={label} label={null} /> : value["@id"]}
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
      {value["@value"]} ({value["@type"]})
    </Component>
  );
};

export default Value;
