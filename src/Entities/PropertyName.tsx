import React from "react";
import { Link } from "react-router-dom";
import {
  RDFS_LABEL,
  JSON_LD_TYPE,
  RDFS_SUB_CLASS_OF,
  RDFS_COMMENT
} from "./data";
import { entityLink } from "./navigation";

const PropertyName = ({ property }: { property: string }) => {
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
  return (
    <b>
      <Link to={entityLink(property)}>{property}</Link>
    </b>
  );
};

export default PropertyName;
