import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import sortBy from "lodash.sortby";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import { getClasses, Labeled, Label } from "./data";
import useEntityID from "./useEntityID";
import ID, { getRenderInfo } from "./ID";
import "./Classes.css";

type Props = {
  serverURL: string;
  onError: (error: Error) => void;
};

const Classes = ({ serverURL, onError }: Props) => {
  const [classes, setClasses] = useState<Labeled[]>([]);
  const entityID = useEntityID();

  useEffect(() => {
    getClasses(serverURL)
      .then(setClasses)
      .catch(onError);
  }, [serverURL, setClasses, onError]);

  const orderedClasses = sortClasses(classes);
  return (
    <List className="Classes">
      <Link to="/entities">
        <ListItem activated={entityID === ""}>All</ListItem>
      </Link>
      {orderedClasses.map(record => {
        const classID = record["@id"];
        const Component = (props: Object) => (
          <ListItem {...props} activated={classID === entityID} />
        );
        return (
          <ID
            key={classID}
            id={classID}
            label={record.label}
            Component={Component}
          />
        );
      })}
    </List>
  );
};

export default Classes;

function sortClasses(classes: Labeled[]) {
  return sortBy(classes, cls => {
    const info = getRenderInfo(cls["@id"], cls.label);
    const { label } = info;
    if (typeof label === "string") {
      return label;
    }
    return label["@value"];
  });
}
