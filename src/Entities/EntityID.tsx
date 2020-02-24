import React from "react";
import "./EntityID.css";

type Props = {
  id: string;
};

const EntityID = ({ id }: Props) => <code className="EntityID">{id}</code>;

export default EntityID;
