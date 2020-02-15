import React from "react";
import { RDFS_LABEL, JSON_LD_TYPE, RDFS_SUB_CLASS_OF, Label } from "./data";
import Value from "./Value";

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
    return <b>Types</b>;
  }
  if (property === RDFS_SUB_CLASS_OF) {
    return <b>Sub Class Of</b>;
  }
  return (
    <b>
      <Value value={{ "@id": property }} label={label} />
    </b>
  );
};

export default PropertyName;
