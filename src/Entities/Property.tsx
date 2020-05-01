import React from "react";
import { Entity as EntityData } from "./data";
import EntityTitle from "./EntityTitle";
import EntityComment from "./EntityComment";
import EntityID from "./EntityID";
import Properties, { Excluded } from "./Properties";
import {
  OWL_DATA_PROPERTY,
  OWL_OBJECT_PROPERTY,
  RDF_PROPERTY,
  OWL_ANNOTATION_PROPERTY,
} from "./constants";

type Props = {
  id: string;
  data: EntityData;
};

const EXCLUDED: Excluded = {
  "@type": new Set([
    OWL_DATA_PROPERTY,
    OWL_OBJECT_PROPERTY,
    OWL_ANNOTATION_PROPERTY,
    RDF_PROPERTY,
  ]),
};

const Property = ({ id, data }: Props) => {
  return (
    <div className="Entity">
      <EntityTitle id={id} data={data} type="Property" />
      <EntityComment data={data} />
      <EntityID id={id} />
      <Properties data={data} excluding={EXCLUDED} />
    </div>
  );
};

export default Property;
