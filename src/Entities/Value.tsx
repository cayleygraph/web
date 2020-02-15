import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import {
  EntityValue,
  Label,
  XSD,
  XSD_STRING,
  isReference,
  RDFS_CLASS,
  RDF_PROPERTY
} from "./data";
import { entityLink } from "./navigation";

type Props = {
  value: EntityValue;
  label?: Label | null | undefined;
  Component?: React.ComponentType;
};

/**
 * Component to render entity values.
 * An entity value can be either another entity, a simple literal (e.g. number) or text.
 * The component may be provided with a label for an entity.
 * For entities the component will create a link to the entity page.
 * The component may be provided with a Component to wrap the rendered value.
 */
const Value = ({ value, label, Component = Fragment }: Props) => {
  // Entity values
  if (isReference(value)) {
    const id = value["@id"];
    if (id === RDFS_CLASS) {
      return (
        <a href="https://www.w3.org/TR/rdf-schema/#ch_class">
          <Component>Class</Component>
        </a>
      );
    }
    if (id === RDF_PROPERTY) {
      return (
        <a href="https://www.w3.org/TR/rdf-schema/#ch_property">
          <Component>Property</Component>
        </a>
      );
    }
    if (id.startsWith(XSD)) {
      return (
        <a href={id}>
          <Component>{id.substr(XSD.length)}</Component>
        </a>
      );
    }
    return (
      <Link to={entityLink(id)}>
        <Component>
          {label ? <Value value={label} label={null} /> : id}
        </Component>
      </Link>
    );
  }
  // Text values
  if (typeof value === "string") {
    return <Component>{value}</Component>;
  }
  // Localized text
  if ("@language" in value) {
    return (
      <Component>
        {value} ({value["@language"]})
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
        {value["@value"]} (<Value value={{ "@id": type }} />)
      </Component>
    );
  }
  throw new Error(`Can not render ${JSON.stringify(value)}`);
};

export default Value;
