import React from "react";
import { Link } from "react-router-dom";
import {
  RDFS_LABEL,
  JSON_LD_TYPE,
  RDFS_SUB_CLASS_OF,
  RDFS_COMMENT,
  Label
} from "./data";
import { entityLink } from "./navigation";

const PropertyName = ({
  property,
  label
}: {
  property: string;
  label?: Label;
}) => {
  if (property === RDFS_LABEL) {
    // Will only render if there are multiple labels
    return <b>Labels</b>;
  }
  if (property === JSON_LD_TYPE) {
    return <b>Type</b>;
  }
  if (property === RDFS_SUB_CLASS_OF) {
    return <b>Sub Class Of</b>;
  }
  const display = label || property;
  return (
    <b>
      <Link to={entityLink(property)}>{display}</Link>
    </b>
  );
};

export default PropertyName;
