import * as React from "react";
import * as monaco from "monaco-editor";
import { EditorDidMount } from "@monaco-editor/react";

export let theme = "dark";

export const setTheme = (value: "light" | "dark") => {
  theme = value;
};

export const DEFAULT_OPTIONS: monaco.editor.IDiffEditorConstructionOptions = {
  minimap: { enabled: false },
  scrollBeyondLastLine: false
};

export const useEditor = (): [
  EditorDidMount,
  monaco.editor.IStandaloneCodeEditor | null
] => {
  const [editor, setEditor] = React.useState();
  const handleEditorMount = React.useCallback(
    (_, editor) => {
      setEditor(editor);
    },
    [setEditor]
  );
  return [handleEditorMount, editor];
};
