import React from "react";
import { Link } from "react-router-dom";
import { EntityValue, Label, XSD_STRING } from "./data";
import { entityLink } from "./navigation";

const Value = ({
  value,
  label
}: {
  value: EntityValue;
  label?: Label | null | undefined;
}) => {
  if (typeof value === "object" && "@id" in value) {
    return (
      <Link to={entityLink(value["@id"])}>
        {label ? <Value value={label} label={null} /> : value["@id"]}
      </Link>
    );
  }
  if (typeof value === "string") {
    return <>{value}</>;
  }
  if ("@type" in value && value["@type"] === XSD_STRING) {
    return <>{value["@value"]}</>;
  }
  if ("@language" in value) {
    return (
      <>
        {value} {value["@language"]}
      </>
    );
  }
  return (
    <>
      {value["@value"]} ({value["@type"]})
    </>
  );
};

export default Value;
