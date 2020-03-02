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
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Page<Labeled> | null>(null);
  const [page, setPage] = useState<number>(0);

  const handleQueryChange = useCallback(
    event => {
      setQ(event.target.value);
    },
    [setQ]
  );

  useEffect(() => {
    setLoading(true);
    query(q, page, pageSize)
      .then(setData)
      .catch(onError)
      .finally(() => {
        setLoading(false);
      });
  }, [query, q, setData, onError, page, pageSize]);

  const hasItems = data && data.data.length !== 0;
  let content;

  if (loading) {
    content = <span>Loading...</span>;
  } else if (!hasItems) {
    content = `No ${title} found`;
  } else {
    content =
      data &&
      data.data.map(record => {
        return (
          <ID
            key={record["@id"]}
            id={record["@id"]}
            label={record.label}
            Component={ListItem}
          />
        );
      });
  }

  return (
    <div className="EntityList">
      <header>
        <h3>{title}</h3>
        <TextField
          onChange={handleQueryChange}
          value={q}
          disabled={!hasItems && !q}
          label="Search"
          trailingIcon="search"
        />
      </header>
      <List>{content}</List>
      {hasItems && (
        <Paginator
          pageSize={pageSize}
          value={page}
          length={data ? data.total : undefined}
          onChange={setPage}
        />
      )}
    </div>
  );
};

export default EntityList;
