import React, { useState, useCallback, useEffect } from "react";
import { Snackbar } from "@rmwc/snackbar";
import "@material/snackbar/dist/mdc.snackbar.css";
import "@material/button/dist/mdc.button.css";
import { Card } from "@rmwc/card";
import "@material/card/dist/mdc.card.css";
import "@material/select/dist/mdc.select.css";
import { TabBar, Tab } from "@rmwc/tabs";
import "@material/tab-scroller/dist/mdc.tab-scroller.css";
import "@material/tab-indicator/dist/mdc.tab-indicator.css";
import "@material/tab-bar/dist/mdc.tab-bar.css";
import "@material/tab/dist/mdc.tab.css";
import useDimensions from "react-use-dimensions";
import QueryEditor from "./QueryEditor";
import JSONCodeViewer from "./JSONCodeViewer";
import useQueryHistory from "./use-query-history";
import QueryHistory from "./QueryHistory";
import Visualize from "./Visualize";
import RunButton from "../RunButton";
import Timer from "./Timer";
import LanguageSelect from "./LanguageSelect";
import { Query, runQuery, getShape, QueryResult, Language } from "../queries";
import { getLastQuery, setLastQuery } from "./lastQuery";
import "./QueryPage.css";

type Props = {
  serverURL: string;
};

enum ActiveTab {
  Result = 0,
  QueryHistory,
  Shape,
  Visualize
}

function QueryPage({ serverURL }: Props) {
  const [initialValue, setInitialValue] = useState<string | null>(null);
  const [queryHistory, addQuery, setResultForQuery] = useQueryHistory();
  const [language, setLanguage] = useState<Language>("gizmo");
  const [running, setRunning] = useState<boolean>(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [activeTabIndex, setActiveTabIndex] = useState<ActiveTab>(
    ActiveTab.Result
  );

  const [shapeResult, setShapeResult] = useState<QueryResult | null>(null);

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

  const run = useCallback(() => {
    const query = getLastQuery(language);
    setRunning(true);
    if (activeTabIndex === ActiveTab.QueryHistory) {
      setActiveTabIndex(ActiveTab.Result);
    }
    if (activeTabIndex === 2) {
      getShape(serverURL, language, query.text)
        .then(result => setShapeResult(result))
        .catch(handleError)
        .finally(() => setRunning(false));
    } else {
      const id = addQuery(query);
      runQuery(serverURL, language, query.text)
        .then(result => {
          setResult(result);
          setResultForQuery(id, result);
        })
        .catch(handleError)
        .finally(() => setRunning(false));
    }
  }, [
    language,
    serverURL,
    activeTabIndex,
    setActiveTabIndex,
    handleError,
    setRunning,
    addQuery,
    setResultForQuery
  ]);

  const [resultsCardRef, { width, height }] = useDimensions();

  const handleRecovery = useCallback(
    (query: Query) => {
      setInitialValue(query.text);
      setLanguage(query.language);
    },
    [setInitialValue, setLanguage]
  );

  const handleEditorChange = useCallback(
    query => {
      setInitialValue(null);
      setLastQuery({ text: query, language });
    },
    [language]
  );

  useEffect(() => {
    const lastQuery = getLastQuery(language);
    setInitialValue(lastQuery.text);
  }, [language]);

  return (
    <main className="QueryPage">
      <Snackbar
        open={snackbarMessage !== null}
        onClose={unsetSnackbarMessage}
        message={snackbarMessage}
      />
      <QueryEditor
        initialValue={initialValue}
        language={language}
        onChange={handleEditorChange}
        onRun={run}
      />
      <div className="actions">
        <RunButton onClick={run} />
        <LanguageSelect value={language} onChange={setLanguage} />
        <Timer running={running} />
      </div>
      <TabBar activeTabIndex={activeTabIndex} onActivate={handleTabActive}>
        <Tab>Results</Tab>
        <Tab>Query History</Tab>
        <Tab>Shape</Tab>
        <Tab>Visualize</Tab>
      </TabBar>
      <Card ref={resultsCardRef} className="query-results">
        {activeTabIndex === ActiveTab.Result && (
          <JSONCodeViewer height={height} value={result} />
        )}
        {activeTabIndex === ActiveTab.QueryHistory && (
          <QueryHistory queries={queryHistory} onRecovery={handleRecovery} />
        )}
        {activeTabIndex === ActiveTab.Shape && (
          <JSONCodeViewer height={height} value={shapeResult} />
        )}
        {activeTabIndex === ActiveTab.Visualize && (
          <Visualize height={height} width={width} value={result} />
        )}
      </Card>
    </main>
  );
}

export default QueryPage;
