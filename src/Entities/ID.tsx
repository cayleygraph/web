import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { capitalCase } from "capital-case";
import { Label, getNativeIDDescriptor } from "./data";
import { entityLink } from "./navigation";
import Value from "./Value";

type IDRenderInfo = {
  label: Label;
  link: string;
  native: boolean;
};

const ID = ({
  id,
  label,
  Component = Fragment
}: {
  id: string;
  label?: Label | undefined | null;
  Component?: React.ComponentType;
}) => {
  const renderInfo = getRenderInfo(id, label);
  if (renderInfo.native) {
    return (
      <a href={renderInfo.link}>
        <Component>{renderInfo.label}</Component>
      </a>
    );
  }
  return (
    <Link to={renderInfo.link}>
      <Component>
        <Value value={renderInfo.label} />
      </Component>
    </Link>
  );
};

export default ID;

export const getRenderInfo = (
  id: string,
  label: Label | undefined | null
): IDRenderInfo => {
  const nativeIDDescriptor = getNativeIDDescriptor(id);
  if (nativeIDDescriptor) {
    return {
      label: nativeIDDescriptor.label,
      link: nativeIDDescriptor.link,
      native: true
    };
  }
  return {
    label: label || idToDisplay(id),
    link: entityLink(id),
    native: false
  };
};

export function idToDisplay(id: string): string {
  try {
    const url = new URL(id);
    if (url.hash) {
      return capitalCase(url.hash.substr(1));
    }
    if (url.pathname.length > 1) {
      const parts = url.pathname.split("/");
      const lastPart = parts[parts.length - 1];
      if (lastPart) {
        return capitalCase(lastPart);
      }
    }
    return id;
  } catch {
    return id;
  }
}
