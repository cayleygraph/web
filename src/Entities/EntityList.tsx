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
  searchEntities: (
    query: string,
    page: number,
    pageSize: number
  ) => Promise<Page<Labeled>>;
  onError: (error: Error) => void;
  pageSize: number;
};

const EntityList = ({ title, searchEntities, pageSize, onError }: Props) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<Page<Labeled> | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(0);

  const handleQueryChange = useCallback(
    (event) => {
      setQuery(event.target.value);
    },
    [setQuery]
  );

  useEffect(() => {
    setLoading(true);
    searchEntities(query, pageNumber, pageSize)
      .then(setPage)
      .catch(onError)
      .finally(() => {
        setLoading(false);
      });
  }, [searchEntities, query, setPage, onError, pageNumber, pageSize]);

  const hasItems = page && page.data.length !== 0;
  let content;

  if (loading) {
    content = <span>Loading...</span>;
  } else if (!hasItems) {
    content = `No ${title} found`;
  } else {
    content =
      page &&
      page.data.map((record) => {
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
          value={query}
          disabled={!hasItems && !query}
          label="Search"
          trailingIcon="search"
        />
      </header>
      <List>{content}</List>
      {hasItems && (
        <Paginator
          pageSize={pageSize}
          value={pageNumber}
          length={page ? page.total : undefined}
          onChange={setPageNumber}
        />
      )}
    </div>
  );
};

export default EntityList;
