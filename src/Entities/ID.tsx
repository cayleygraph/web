import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import noCase from "no-case";
import { Label, getNativeIDDescriptor } from "./data";
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
  const nativeIDDescriptor = getNativeIDDescriptor(id);
  if (nativeIDDescriptor) {
    return (
      <a href={nativeIDDescriptor.link}>
        <Component>{nativeIDDescriptor.label}</Component>
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

/** @todo use a library for this */
const formatName = (name: string): string => {
  return noCase(name)
    .split(" ")
    .map(part => part[0].toUpperCase() + part.substr(1))
    .join(" ");
};

export function idToDisplay(id: string): string {
  try {
    const url = new URL(id);
    if (url.hash) {
      return formatName(url.hash.substr(1));
    }
    if (url.pathname.length > 1) {
      const parts = url.pathname.split("/");
      return formatName(parts[parts.length - 1]);
    }
    return id;
  } catch {
    return id;
  }
}
