import React, { useState, useEffect } from "react";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import { getClassesPage } from "./data";
import Value from "./Value";

const Classes = ({ serverURL }: { serverURL: string }) => {
  const [classes, setClasses] = useState<any[]>([]);
  useEffect(() => {
    getClassesPage(serverURL, 0, 10)
      .then(setClasses)
      /** @todo send error up */
      .catch(console.error);
  }, []);
  return (
    <div>
      <h2>Classes</h2>
      <List>
        {classes.map(record => {
          return (
            <ListItem key={record.id["@id"]}>
              <Value value={record.id} label={record.label} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default Classes;
