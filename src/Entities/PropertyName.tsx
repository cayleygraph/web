import React from "react";
import { Link } from "react-router-dom";
import { RDFS_LABEL, RDF_TYPE } from "./data";
import { entityLink } from "./navigation";

const PropertyName = ({ property }: { property: string }) => {
  if (property === RDFS_LABEL) {
    return <b>Label</b>;
  }
  if (property === RDF_TYPE) {
    return <b>Type</b>;
  }
  return (
    <b>
      <Link to={entityLink(property)}>{property}</Link>
    </b>
  );
};

export default PropertyName;
