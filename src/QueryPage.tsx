import React, { useState } from "react";
import { editor } from "monaco-editor";
import MonacoEditor from "@monaco-editor/react";
import { Card } from "@rmwc/card";
import "@material/card/dist/mdc.card.css";
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";
import { TabBar, Tab } from "@rmwc/tabs";
import "@material/tab-scroller/dist/mdc.tab-scroller.css";
import "@material/tab-indicator/dist/mdc.tab-indicator.css";
import "@material/tab-bar/dist/mdc.tab-bar.css";
import "@material/tab/dist/mdc.tab.css";
import Result from "./Result";
import QueryHistory from "./QueryHistory";
import { useEditor } from "./monaco-util";
import { Query } from "./types";
import "./QueryPage.css";

const ACTIVE_QUERY_INITIAL_STATE: number | null = null;
const QUERIES_INITIAL_STATE: Query[] = [];

type Props = {
  serverURL: string;
};

function QueryPage({ serverURL }: Props) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [language, setLanguage] = useState("gizmo");
  const [activeQuery, setActiveQuery] = useState(ACTIVE_QUERY_INITIAL_STATE);
  const [queries, setQueries] = useState(QUERIES_INITIAL_STATE);
  const [handleEditorMount, editor] = useEditor();

  const handleClick = React.useCallback(() => {
    const id = queries.length;
    const query = editor.getValue();
    setActiveQuery(id);
    setQueries(queries => [
      ...queries,
      { id, text: query, result: null, time: new Date() }
    ]);
    fetch(`${serverURL}/api/v1/query/${language}`, {
      method: "POST",
      body: query
    })
      .then(res => res.json())
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
      });
  }, [editor, queries]);

  const currentQuery = queries.find(query => query.id === activeQuery);
  const result = currentQuery ? currentQuery.result : null;

  const options: editor.IDiffEditorConstructionOptions = {
    minimap: { enabled: false }
  };

  return (
    <main>
      <Card className="Run">
        <MonacoEditor
          height={300}
          editorDidMount={handleEditorMount}
          language="javascript"
          options={options}
        />
        <Button
          icon="play_circle_filled"
          unelevated
          label="Run"
          onClick={handleClick}
        />
      </Card>
      <Card>
        <TabBar
          style={{ width: "30em" }}
          activeTabIndex={activeTabIndex}
          onActivate={evt => setActiveTabIndex(evt.detail.index)}
        >
          <Tab>Results</Tab>
          <Tab>Query History</Tab>
        </TabBar>
        {activeTabIndex === 0 && <Result result={result} />}
        {activeTabIndex === 1 && <QueryHistory queries={queries} />}
      </Card>
    </main>
  );
}

export default QueryPage;
