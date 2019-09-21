import React from "react";
import * as monaco from "monaco-editor";
import MonacoEditor from "@monaco-editor/react";

const Result = ({ result }: { result: object | null }) => {
  const options: monaco.editor.IDiffEditorConstructionOptions = {
    readOnly: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false
  };

  return (
    <MonacoEditor
      height={300}
      value={result ? JSON.stringify(result, null, 4) : ""}
      language="json"
      options={options}
    />
  );
};

export default Result;
