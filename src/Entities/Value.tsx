import React, { Fragment } from "react";
import { XSD_STRING } from "./data";
import {
  JsonLdPrimitiveValue,
  normalizePrimitiveValue,
  isJsonLDLocalizedPrimitiveValue,
  isJsonLDTypedPrimitiveValue
} from "./json-ld";
import ID from "./ID";

type Props = {
  value: JsonLdPrimitiveValue;
  Component?: React.ComponentType;
};

const Value = ({ value, Component = Fragment }: Props) => {
  // Normalize value to handle less edge cases
  value = normalizePrimitiveValue(value);

  if (typeof value === "string") {
    return <Component>{value}</Component>;
  }

  if (isJsonLDLocalizedPrimitiveValue(value)) {
    return (
      <Component>
        {value["@value"]} ({value["@language"]})
      </Component>
    );
  }

  if (isJsonLDTypedPrimitiveValue(value)) {
    const type = value["@type"];
    return (
      <Component>
        {value["@value"]} (<ID id={type} />)
      </Component>
    );
  }

  throw new Error(`Can not render ${JSON.stringify(value)}`);
};

export default Value;
