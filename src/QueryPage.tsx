import React, { useState, useCallback } from "react";
import { Snackbar } from "@rmwc/snackbar";
import "@material/snackbar/dist/mdc.snackbar.css";
import "@material/button/dist/mdc.button.css";
import { Card } from "@rmwc/card";
import "@material/card/dist/mdc.card.css";
import { TabBar, Tab } from "@rmwc/tabs";
import "@material/tab-scroller/dist/mdc.tab-scroller.css";
import "@material/tab-indicator/dist/mdc.tab-indicator.css";
import "@material/tab-bar/dist/mdc.tab-bar.css";
import "@material/tab/dist/mdc.tab.css";
import useDimensions from "react-use-dimensions";
import QueryEditor from "./QueryEditor";
import JSONCodeViewer from "./JSONCodeViewer";
import QueryHistory from "./QueryHistory";
import Visualize from "./Visualize";
import { Query, runQuery, getShape, QueryResult } from "./queries";

const ACTIVE_QUERY_INITIAL_STATE: number | null = null;
const QUERIES_INITIAL_STATE: Query[] = [];

type Props = {
  serverURL: string;
};

function QueryPage({ serverURL }: Props) {
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const [activeQuery, setActiveQuery] = useState(ACTIVE_QUERY_INITIAL_STATE);
  const [queries, setQueries] = useState(QUERIES_INITIAL_STATE);
  const [shapeResult, setShapeResult] = useState<QueryResult>(null);

  const unsetSnackbarMessage = useCallback(() => {
    setSnackbarMessage(null);
  }, [setSnackbarMessage]);

  const handleError = useCallback(
    error => {
      setSnackbarMessage(error.toString());
    },
    [setSnackbarMessage]
  );

  const handleTabActive = useCallback(
    event => {
      setActiveTabIndex(event.detail.index);
    },
    [setActiveTabIndex]
  );

  const handleRun = useCallback(
    (query, language, onDone) => {
      if (activeTabIndex === 1) {
        setActiveTabIndex(0);
      }
      if (activeTabIndex === 2) {
        getShape(serverURL, language, query)
          .then(result => setShapeResult(result))
          .catch(handleError)
          .finally(onDone);
      } else {
        const id = queries.length;
        setActiveQuery(id);
        setQueries(queries => [
          ...queries,
          {
            id,
            text: query,
            result: null,
            language,
            time: new Date()
          }
        ]);
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
          .catch(handleError)
          .finally(onDone);
      }
    },
    [queries, serverURL, activeTabIndex, setActiveTabIndex, handleError]
  );

  const [ref, { width, height }] = useDimensions();

  const handleRecovery = useCallback((query: Query) => {
    /** @todo recover query */
  }, []);

  const currentQuery = queries.find(query => query.id === activeQuery);
  const result = currentQuery ? currentQuery.result : null;

  return (
    <main>
      <Snackbar
        open={snackbarMessage !== null}
        onClose={unsetSnackbarMessage}
        message={snackbarMessage}
      />
      <QueryEditor onRun={handleRun} />
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
      <Card ref={ref} className="query-results">
        {activeTabIndex === 0 && (
          <JSONCodeViewer height={height} value={result} />
        )}
        {activeTabIndex === 1 && (
          <QueryHistory queries={queries} onRecovery={handleRecovery} />
        )}
        {activeTabIndex === 2 && (
          <JSONCodeViewer height={height} value={shapeResult} />
        )}
        {activeTabIndex === 3 && (
          <Visualize height={height} width={width} value={result} />
        )}
      </Card>
    </main>
  );
}

export default QueryPage;
