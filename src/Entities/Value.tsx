import React, { Fragment } from "react";
import * as jsonLd from "./json-ld";
import ID from "./ID";

const DEFAULT_LANGUAGE = "en";

type Props = {
  value: jsonLd.PrimitiveValue;
  Component?: React.ComponentType;
};

const Value = ({ value, Component = Fragment }: Props) => {
  // Normalize value to handle less edge cases
  value = jsonLd.normalizePrimitiveValue(value);

  if (typeof value === "string") {
    return <Component>{value}</Component>;
  }

  if (jsonLd.isLocalizedText(value)) {
    const language = value["@language"];
    if (language === DEFAULT_LANGUAGE) {
      return <Component>{value["@value"]}</Component>;
    }
    return (
      <Component>
        {value["@value"]} ({value["@language"]})
      </Component>
    );
  }

  if (jsonLd.isTypedPrimitiveValue(value)) {
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
