import React, { Fragment } from "react";
import { XSD_STRING } from "./data";
import { JsonLdPrimitiveValue } from "./json-ld";
import ID from "./ID";

type Props = {
  value: string | JsonLdPrimitiveValue;
  Component?: React.ComponentType;
};

const Value = ({ value, Component = Fragment }: Props) => {
  // Text values
  if (typeof value === "string") {
    return <Component>{value}</Component>;
  }
  // Localized text
  if ("@language" in value) {
    return (
      <Component>
        {value["@value"]} ({value["@language"]})
      </Component>
    );
  }
  // Literal values
  if ("@type" in value) {
    const type = value["@type"];
    if (type === XSD_STRING) {
      return <Component>{value["@value"]}</Component>;
    }
    return (
      <Component>
        {value["@value"]} (<ID id={type} />)
      </Component>
    );
  }
  throw new Error(`Can not render ${JSON.stringify(value)}`);
};

export default Value;
