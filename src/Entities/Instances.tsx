import React, { useState, useEffect } from "react";
import { getInstancesPage, InstanceRecord } from "./data";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import "./Instances.css";

import Value from "./Value";

type Props = { classID: string; serverURL: string };

const PAGE_SIZE = 10;

const Instances = ({ classID, serverURL }: Props) => {
  const [data, setData] = useState<InstanceRecord[] | null>(null);
  const [page, setPage] = useState<number>(0);
  const [error, setError] = useState();
  useEffect(() => {
    getInstancesPage(serverURL, classID, page, PAGE_SIZE)
      .then(setData)
      .catch(setError);
  }, [serverURL, classID, setData, setError, page]);
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
    <div className="Instances">
      <h3>Instances</h3>
      <List>
        {data.map(record => {
          return (
            <Value
              value={record.id}
              label={record.label}
              Component={ListItem}
            />
          );
        })}
      </List>
    </div>
  );
};

export default Instances;
