import * as React from "react";
import * as monaco from "monaco-editor";
import { EditorDidMount } from "@monaco-editor/react";

export const useEditor = (): [
  EditorDidMount,
  monaco.editor.ICodeEditor | null
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
