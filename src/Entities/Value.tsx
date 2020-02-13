import React from "react";
import { Link } from "react-router-dom";
import { entityLink } from "./navigation";

const Value = ({
  value,
  label
}: {
  value: string | { "@type": string; "@value": string };
  label: string | { "@type": string; "@value": string } | null;
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
  return (
    <>
      {value["@value"]} ({value["@type"]})
    </>
  );
};

export default Value;
