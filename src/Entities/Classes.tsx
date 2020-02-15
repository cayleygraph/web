import React, { useState, useEffect } from "react";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import { getClasses, ClassRecord } from "./data";
import Value from "./Value";
import "./Classes.css";
import { Link } from "react-router-dom";
import useEntityID from "./useEntityID";

type Props = {
  serverURL: string;
  onError: (error: Error) => void;
};

const Classes = ({ serverURL, onError }: Props) => {
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const entityID = useEntityID();

  useEffect(() => {
    getClasses(serverURL)
      .then(setClasses)
      .catch(onError);
  }, [serverURL, setClasses]);

  const orderedClasses = sortClasses(classes);
  return (
    <List className="Classes">
      <Link to="/entities">
        <ListItem activated={entityID === ""}>All</ListItem>
      </Link>
      {orderedClasses.map(record => {
        const classID = record.id["@id"];
        const Component = (props: Object) => (
          <ListItem {...props} activated={classID === entityID} />
        );
        return (
          <Value
            key={classID}
            value={record.id}
            label={record.label}
            Component={Component}
          />
        );
      })}
    </List>
  );
};

export default Classes;

function sortClasses(classes: ClassRecord[]) {
  const orderedClasses = [...classes];
  orderedClasses.sort((a, b) => {
    if ((a.label || b.id) < (b.label || b.id)) {
      return -1;
    }
    return 1;
  });
  return orderedClasses;
}
