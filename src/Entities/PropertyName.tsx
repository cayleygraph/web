import React from "react";
import {
  labelPropertyID,
  typePropertyID,
  subClassOfPropertyID,
  Label
} from "./data";
import ID from "./ID";

const PropertyName = ({
  property,
  label
}: {
  property: string;
  label?: Label;
}) => {
  if (property === labelPropertyID) {
    // Will only render if there are multiple labels
    return <b>Labels</b>;
  }
  if (property === typePropertyID) {
    return <b>Types</b>;
  }
  if (property === subClassOfPropertyID) {
    return <b>Sub Class Of</b>;
  }
  return (
    <b>
      <ID id={property} label={label} />
    </b>
  );
};

export default PropertyName;
