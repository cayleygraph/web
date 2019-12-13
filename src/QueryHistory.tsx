import React, { useCallback } from "react";
import { List, ListItem } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import { Icon } from "@rmwc/icon";
import "@rmwc/icon/icon.css";
import { Query, languageOptions } from "./queries";
import "./QueryHistory.css";

type OnRecovery = (query: Query) => void;

type Props = { queries: Query[]; onRecovery: OnRecovery };

const QueryHistoryItem = ({
  query,
  onRecovery
}: {
  query: Query;
  onRecovery: OnRecovery;
}) => {
  const option = languageOptions.find(
    option => option.value === query.language
  );
  const handleClick = useCallback(() => {
    onRecovery(query);
  }, [query, onRecovery]);
  return (
    <ListItem key={query.id} onClick={handleClick}>
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
};

const QueryHistory = ({ queries, onRecovery }: Props) => (
  <List className="QueryHistory">
    {[...queries].reverse().map(query => {
      return (
        <QueryHistoryItem
          key={query.id}
          query={query}
          onRecovery={onRecovery}
        />
      );
    })}
  </List>
);

export default QueryHistory;
