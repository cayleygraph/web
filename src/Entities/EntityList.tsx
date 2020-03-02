import React, { useState, useEffect, useCallback } from "react";
import { Labeled, Page } from "./data";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import { TextField } from "@rmwc/textfield";
import "@material/textfield/dist/mdc.textfield.css";
import Paginator from "./Paginator";
import ID from "./ID";
import "./EntityList.css";

type Props = {
  title: string;
  query: (
    query: string,
    page: number,
    pageSize: number
  ) => Promise<Page<Labeled>>;
  onError: (error: Error) => void;
  pageSize: number;
};

const EntityList = ({ title, query, pageSize, onError }: Props) => {
  const [q, setQ] = useState("");
  const [data, setData] = useState<Page<Labeled> | null>(null);
  const [page, setPage] = useState<number>(0);

  const handleQueryChange = useCallback(
    event => {
      setQ(event.target.value);
    },
    [setQ]
  );

  useEffect(() => {
    query(q, page, pageSize)
      .then(setData)
      .catch(onError);
  }, [query, q, setData, onError, page, pageSize]);

  if (data === null) {
    return <span>"Loading..."</span>;
  }

  const noItems = data.data.length === 0;

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
      <header>
        <h3>{title}</h3>
        <TextField
          onChange={handleQueryChange}
          value={q}
          disabled={noItems && !q}
          label="Search"
          trailingIcon="search"
        />
      </header>
      <List>{noItems ? `No ${title} found` : itemNodes}</List>
      {!noItems && (
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
