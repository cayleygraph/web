import React, { useState, useEffect } from "react";
import { getInstancesPage, InstanceRecord } from "./data";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import "./Instances.css";

import Value from "./Value";
import Paginator from "./Paginator";

type Props = {
  classID: string;
  serverURL: string;
  onError: (error: Error) => void;
};

const PAGE_SIZE = 10;

const Instances = ({ classID, serverURL, onError }: Props) => {
  const [data, setData] = useState<InstanceRecord[] | null>(null);
  const [page, setPage] = useState<number>(0);
  useEffect(() => {
    getInstancesPage(serverURL, classID, page, PAGE_SIZE)
      .then(setData)
      .catch(onError);
  }, [serverURL, classID, setData, onError, page]);
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
  return (
    <div className="Instances">
      <h3>Instances</h3>
      <List>{data.length === 0 ? "No instances" : itemNodes}</List>
      <Paginator pageSize={PAGE_SIZE} value={page} onChange={setPage} />
    </div>
  );
};

export default Instances;
