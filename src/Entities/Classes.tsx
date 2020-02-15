import React, { useState, useEffect } from "react";
import { Drawer, DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import "@material/drawer/dist/mdc.drawer.css";
import { getClasses } from "./data";
import Value from "./Value";
import "./Classes.css";
import { Link } from "react-router-dom";

type Props = { serverURL: string; entityID: string };

const Classes = ({ serverURL, entityID }: Props) => {
  const [classes, setClasses] = useState<any[]>([]);
  useEffect(() => {
    getClasses(serverURL)
      .then(setClasses)
      /** @todo send error up */
      .catch(console.error);
  }, [serverURL, setClasses]);
  const orderedClasses = [...classes];
  orderedClasses.sort((a, b) => {
    if ((a.label || b.id) < (b.label || b.id)) {
      return -1;
    }
    return 1;
  });
  return (
    <div className="Classes">
      <Drawer>
        <DrawerHeader>
          <DrawerTitle>Types</DrawerTitle>
        </DrawerHeader>
        <DrawerContent>
          <List>
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
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Classes;
