import React, { useState, useEffect } from "react";
import { getInstancesPage, InstanceRecord } from "./data";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import "./Instances.css";

import Value from "./Value";

type Props = {
  classID: string;
  serverURL: string;
  onError: (error: Error) => void;
};

const PAGE_SIZE = 10;

const Instances = ({ classID, serverURL, onError }: Props) => {
  const [data, setData] = useState<InstanceRecord[] | null>(null);
  const [page, setPage] = useState<number>(0);
  const [error, setError] = useState();
  useEffect(() => {
    getInstancesPage(serverURL, classID, page, PAGE_SIZE)
      .then(setData)
      .catch(setError);
  }, [serverURL, classID, setData, setError, page]);
  /** @todo replace with snackbar */
  if (error) {
    console.error(error);
    return null;
  }
  if (data === null) {
    return <span>"Loading..."</span>;
  }
  const itemNodes = data.map(record => {
    return (
      <Value
        key={record.id["@id"]}
        value={record.id}
        label={record.label}
        Component={ListItem}
      />
    );
  });
  /** @todo navigation controls */
  return (
    <div className="Instances">
      <h3>Instances</h3>
      <List>{data.length === 0 ? "No instances" : itemNodes}</List>
    </div>
  );
};

export default Instances;
