import React, { useState, useEffect } from "react";
import { getInstancesPage, InstancesPage } from "./data";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import "./Instances.css";

import EntityValue from "./EntityValue";
import Paginator from "./Paginator";

type Props = {
  classID: string;
  serverURL: string;
  onError: (error: Error) => void;
};

const PAGE_SIZE = 10;

const Instances = ({ classID, serverURL, onError }: Props) => {
  const [data, setData] = useState<InstancesPage | null>(null);
  const [page, setPage] = useState<number>(0);
  useEffect(() => {
    getInstancesPage(serverURL, classID, page, PAGE_SIZE)
      .then(setData)
      .catch(onError);
  }, [serverURL, classID, setData, onError, page]);
  if (data === null) {
    return <span>"Loading..."</span>;
  }
  const itemNodes = data.data.map(record => {
    return (
      <EntityValue
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
      <List>{data.data.length === 0 ? "No instances" : itemNodes}</List>
      {data.data.length !== 0 && (
        <Paginator
          pageSize={PAGE_SIZE}
          value={page}
          length={data.total}
          onChange={setPage}
        />
      )}
    </div>
  );
};

export default Instances;
