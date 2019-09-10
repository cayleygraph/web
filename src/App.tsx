import React from "react";
import MonacoEditor from "@monaco-editor/react";
import { useEditorValue } from "./monaco-util";
import "./App.css";

function App() {
  const [handleEditorMount, value] = useEditorValue();

  console.log(value);

  return (
    <div className="App">
      <h1>Cayley</h1>
      <MonacoEditor height={300} editorDidMount={handleEditorMount} />
    </div>
  );
}

export default App;
