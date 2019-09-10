import React, { useState } from "react";
import { Card } from "@rmwc/card";
import "@material/card/dist/mdc.card.css";
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";
import MonacoEditor from "@monaco-editor/react";
import { useEditor } from "./monaco-util";
import "./App.css";

function App() {
  const [handleEditorMount, editor] = useEditor();
  const [result, setResult] = useState("");

  const handleClick = React.useCallback(
    event => {
      console.log(editor.getValue());
      fetch("http://localhost:64210/api/v1/query/gizmo", {
        method: "POST",
        body: editor.getValue()
      })
        .then(res => res.text())
        .then(res => setResult(res));
    },
    [editor]
  );

  let formattedResult = result;

  try {
    formattedResult = JSON.stringify(JSON.parse(result), null, 4);
  } catch {}

  return (
    <div className="App">
      <h1>Cayley</h1>
      <main>
        <Card className="Run">
          <MonacoEditor
            height={300}
            editorDidMount={handleEditorMount}
            language="javascript"
          />
          <Button label="Run" onClick={handleClick} />
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
    </div>
  );
}

export default App;
