import React from "react";
import * as monaco from "monaco-editor";
import MonacoEditor from "@monaco-editor/react";

const options: monaco.editor.IDiffEditorConstructionOptions = {
  readOnly: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false
};

type Props = {
  height: number;
  value: object | null;
};

const JSONCodeViewer = ({ value, height }: Props) => {
  return (
    <MonacoEditor
      height={height}
      value={value ? JSON.stringify(value, null, 4) : ""}
      language="json"
      options={options}
    />
  );
};

export default JSONCodeViewer;
