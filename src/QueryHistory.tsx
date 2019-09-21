import React from "react";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import { Icon } from "@rmwc/icon";
import "@rmwc/icon/icon.css";
import { Query, languageOptions } from "./queries";
import "./QueryHistory.css";

const QueryHistory = ({ queries }: { queries: Query[] }) => (
  <List className="QueryHistory">
    {[...queries].reverse().map(query => {
      const option = languageOptions.find(
        option => option.value === query.language
      );
      return (
        <ListItem key={query.id}>
          <div className="time">{query.time.toLocaleString()}</div>
          <div className="status">
            {query.result ? (
              "error" in query.result ? (
                <Icon icon="error" />
              ) : (
                <Icon icon="check_circle" />
              )
            ) : null}
          </div>
          <div className="language">{option && option.label}</div>
          <div className="query">{query.text}</div>
        </ListItem>
      );
    })}
  </List>
);

export default QueryHistory;
