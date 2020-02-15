import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Label, XSD, RDFS_CLASS, RDF_PROPERTY } from "./data";
import { entityLink } from "./navigation";
import Value from "./Value";

const ID = ({
  id,
  label,
  Component = Fragment
}: {
  id: string;
  label?: Label | null | undefined;
  Component?: React.ComponentType;
}) => {
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
      <Component>{label ? <Value value={label} /> : idToDisplay(id)}</Component>
    </Link>
  );
};

export default ID;

export function idToDisplay(id: string): string {
  try {
    const url = new URL(id);
    if (url.hash) {
      return url.hash.substr(1);
    }
    if (url.pathname.length > 1) {
      const parts = url.pathname.split("/");
      return parts[parts.length - 1];
    }
    return id;
  } catch {
    return id;
  }
}
