import React from "react";
import * as monaco from "monaco-editor";
import MonacoEditor from "@monaco-editor/react";
import { DEFAULT_OPTIONS, theme } from "../monaco-util";

const options: monaco.editor.IDiffEditorConstructionOptions = {
  ...DEFAULT_OPTIONS,
  readOnly: true
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
      theme={theme}
      options={options}
      loading={null}
    />
  );
};

export default JSONCodeViewer;
