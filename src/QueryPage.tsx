import React, { useState, useCallback } from "react";
import { Card } from "@rmwc/card";
import "@material/card/dist/mdc.card.css";
import { TabBar, Tab } from "@rmwc/tabs";
import "@material/tab-scroller/dist/mdc.tab-scroller.css";
import "@material/tab-indicator/dist/mdc.tab-indicator.css";
import "@material/tab-bar/dist/mdc.tab-bar.css";
import "@material/tab/dist/mdc.tab.css";
import QueryEditor from "./QueryEditor";
import JSONCodeViewer from "./JSONCodeViewer";
import QueryHistory from "./QueryHistory";
import Visualize from "./Visualize";
import { Query, runQuery } from "./queries";

const ACTIVE_QUERY_INITIAL_STATE: number | null = null;
const QUERIES_INITIAL_STATE: Query[] = [];

type Props = {
  serverURL: string;
};

function QueryPage({ serverURL }: Props) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const [activeQuery, setActiveQuery] = useState(ACTIVE_QUERY_INITIAL_STATE);
  const [queries, setQueries] = useState(QUERIES_INITIAL_STATE);
  const [shapeResult, setShapeResult] = useState(null);

  const handleTabActive = useCallback(
    event => {
      setActiveTabIndex(event.detail.index);
    },
    [setActiveTabIndex]
  );

  const handleRun = useCallback(
    (query, language, onDone) => {
      const id = queries.length;
      setActiveQuery(id);
      setQueries(queries => [
        ...queries,
        { id, text: query, result: null, language, time: new Date() }
      ]);
      if (activeTabIndex === 2) {
        getShape(serverURL, language, query)
          .then(setShapeResult)
          .catch(error => {
            alert(error);
          })
          .finally(onDone);
      } else {
        setActiveTabIndex(0);
        runQuery(serverURL, language, query)
          .then(result => {
            setQueries(queries =>
              queries.map(query => {
                if (query.id === id) {
                  return { ...query, result };
                } else {
                  return query;
                }
              })
            );
          })
          .catch(error => {
            alert(error);
          })
          .finally(onDone);
      }
    },
    [queries, serverURL, activeTabIndex, setActiveTabIndex]
  );

  const handleRecovery = useCallback((query: Query) => {
    /** @todo recover query */
  }, []);

  const currentQuery = queries.find(query => query.id === activeQuery);
  const result = currentQuery ? currentQuery.result : null;

  return (
    <main>
      <QueryEditor onRun={handleRun} />
      <Card>
        <TabBar
          style={{ maxWidth: "35em" }}
          activeTabIndex={activeTabIndex}
          onActivate={handleTabActive}
        >
          <Tab>Results</Tab>
          <Tab>Query History</Tab>
          <Tab>Shape</Tab>
          <Tab>Visualize</Tab>
        </TabBar>
        {activeTabIndex === 0 && <JSONCodeViewer value={result} />}
        {activeTabIndex === 1 && (
          <QueryHistory queries={queries} onRecovery={handleRecovery} />
        )}
        {activeTabIndex === 2 && <JSONCodeViewer value={shapeResult} />}
        {activeTabIndex === 3 && <Visualize value={result} />}
      </Card>
    </main>
  );
}

export default QueryPage;

async function getShape(serverURL: string, language: string, query: string) {
  const res = await fetch(`${serverURL}/api/v1/shape/${language}`, {
    method: "POST",
    body: query
  });
  const { error, ...result } = await res.json();
  if (error) {
    throw new Error(error);
  }
  return result;
}
