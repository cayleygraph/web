import * as React from "react";
import * as monaco from "monaco-editor";
import { EditorDidMount } from "@monaco-editor/react";

export enum Theme {
  light = "light",
  dark = "dark"
}

export let theme = Theme.light;

export const setTheme = (value: Theme) => {
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
