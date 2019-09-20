import React, { useState } from "react";
import { Card } from "@rmwc/card";
import "@material/card/dist/mdc.card.css";
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";
import MonacoEditor from "@monaco-editor/react";
import { useEditor } from "./monaco-util";

type Query = {
  id: number;
  text: string;
  result: string | null;
  time: Date;
};

const ACTIVE_QUERY_INITIAL_STATE: number | null = null;
const QUERIES_INITIAL_STATE: Query[] = [];

type Props = {
  serverURL: string;
};

function QueryPage({ serverURL }: Props) {
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
      .then(res => res.text())
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
  const result = currentQuery && currentQuery.result;

  let formattedResult = result;

  if (result) {
    try {
      formattedResult = JSON.stringify(JSON.parse(result), null, 4);
    } catch {}
  }

  return (
    <main>
      <Card className="Run">
        <MonacoEditor
          height={300}
          editorDidMount={handleEditorMount}
          language="javascript"
        />
        <Button label="Run" onClick={handleClick} />
      </Card>
      <div>Results | Query History</div>
      <Card>
        {[...queries].reverse().map(query => (
          <div>
            {query.time.toLocaleString()} result? {query.result ? "yes" : "no"}
          </div>
        ))}
      </Card>
      <Card className="Results">
        <MonacoEditor
          height={300}
          value={formattedResult}
          language="json"
          options={{ readOnly: true }}
        />
      </Card>
    </main>
  );
}

export default QueryPage;
