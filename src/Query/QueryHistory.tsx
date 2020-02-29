import React, { useCallback } from "react";
import { List, ListItem, ListGroup, ListGroupSubheader } from "@rmwc/list";
import "@material/list/dist/mdc.list.css";
import { Icon } from "@rmwc/icon";
import "@rmwc/icon/icon.css";
import { Query, languageOptions } from "../queries";
import "./QueryHistory.css";
import { useQueryHistory } from "./query-history-service";

type OnRecovery = (query: Query) => void;

type Props = { onRecovery: OnRecovery };

const TIME_OPTIONS = {
  hour: "2-digit",
  minute: "2-digit"
};

const DATE_OPTIONS = {
  month: "numeric",
  day: "numeric",
  year: "numeric"
};

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
      <div className="time">
        {query.time.toLocaleTimeString([], TIME_OPTIONS)}
      </div>
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

const QueryHistory = ({ onRecovery }: Props) => {
  const queries = useQueryHistory();
  const groupedQueries = groupQueriesByTime(queries);
  return (
    <List className="QueryHistory">
      {groupedQueries.map(group => {
        return (
          <ListGroup key={group.date}>
            <ListGroupSubheader>{group.date}</ListGroupSubheader>
            {group.queries.map(query => (
              <QueryHistoryItem
                key={query.id}
                query={query}
                onRecovery={onRecovery}
              />
            ))}
          </ListGroup>
        );
      })}
    </List>
  );
};

export default QueryHistory;

type QueriesByTime = Array<{ date: string; queries: Query[] }>;

function groupQueriesByTime(queries: Query[]): QueriesByTime {
  const groupedQueries: QueriesByTime = [];
  for (const query of queries) {
    const [group] = groupedQueries;
    const currentDate = group?.date;
    const date = query.time.toLocaleDateString([], DATE_OPTIONS);
    if (date !== currentDate) {
      groupedQueries.unshift({ date, queries: [query] });
    } else {
      group.queries.unshift(query);
    }
  }
  return groupedQueries;
}
