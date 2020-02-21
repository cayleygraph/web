import React, { useState, useEffect } from "react";
import { Labeled, Page } from "./data";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import Paginator from "./Paginator";
import ID from "./ID";
import "./EntityList.css";

type Props = {
  title: string;
  query: (page: number, pageSize: number) => Promise<Page<Labeled>>;
  onError: (error: Error) => void;
  pageSize: number;
};

const EntityList = ({ title, query, pageSize, onError }: Props) => {
  const [data, setData] = useState<Page<Labeled> | null>(null);
  const [page, setPage] = useState<number>(0);
  useEffect(() => {
    query(page, pageSize)
      .then(setData)
      .catch(onError);
  }, [query, setData, onError, page, pageSize]);
  if (data === null) {
    return <span>"Loading..."</span>;
  }
  const itemNodes = data.data.map(record => {
    return (
      <ID
        key={record["@id"]}
        id={record["@id"]}
        label={record.label}
        Component={ListItem}
      />
    );
  });
  return (
    <div className="EntityList">
      <h3>{title}</h3>
      <List>{data.data.length === 0 ? `No ${title} found` : itemNodes}</List>
      {data.data.length !== 0 && (
        <Paginator
          pageSize={pageSize}
          value={page}
          length={data.total}
          onChange={setPage}
        />
      )}
    </div>
  );
};

export default EntityList;
