import React, { useState, useEffect } from "react";
import { getInstancesPage, InstanceRecord } from "./data";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import "./Instances.css";

import Value from "./Value";

type Props = { classID: string; serverURL: string };

const Instances = ({ classID, serverURL }: Props) => {
  const [data, setData] = useState<InstanceRecord[] | null>(null);
  const [error, setError] = useState();
  useEffect(() => {
    getInstancesPage(serverURL, classID, 0, 20)
      .then(setData)
      .catch(setError);
  }, [classID, setData, setError]);
  /** @todo replace with snackbar */
  console.error(error);
  if (error) {
    return null;
  }
  if (data === null) {
    return <span>"Loading..."</span>;
  }
  /** @todo navigation controls */
  return (
    <List className="Instances">
      {data.map(record => {
        return (
          <Value value={record.id} label={record.label} Component={ListItem} />
        );
      })}
    </List>
  );
};

export default Instances;
