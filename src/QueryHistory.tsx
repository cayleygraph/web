import React from "react";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import { Icon } from "@rmwc/icon";
import "@rmwc/icon/icon.css";
import { Query } from "./types";
import "./QueryHistory.css";

const QueryHistory = ({ queries }: { queries: Query[] }) => (
  <List className="QueryHistory">
    {[...queries].reverse().map(query => (
      <ListItem>
        {query.time.toLocaleString()}{" "}
        {query.result ? (
          "error" in query.result ? (
            <Icon icon="error" />
          ) : (
            <Icon icon="check_circle" />
          )
        ) : null}
      </ListItem>
    ))}
  </List>
);

export default QueryHistory;
