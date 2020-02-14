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
    return <b>Label</b>;
  }
  if (property === JSON_LD_TYPE) {
    return <b>Type</b>;
  }
  if (property === RDFS_SUB_CLASS_OF) {
    return <b>Sub Class Of</b>;
  }
  if (property === RDFS_COMMENT) {
    return <b>Comment</b>;
  }
  const display = label || property;
  return (
    <b>
      <Link to={entityLink(property)}>{display}</Link>
    </b>
  );
};

export default PropertyName;
