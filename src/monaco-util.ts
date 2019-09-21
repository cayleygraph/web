import * as React from "react";
import * as monaco from "monaco-editor";
import { EditorDidMount } from "@monaco-editor/react";

export const useEditor = (): [EditorDidMount, monaco.editor.IEditor | null] => {
  const [editor, setEditor] = React.useState();
  const handleEditorMount = React.useCallback(
    (_, editor) => {
      setEditor(editor);
    },
    [setEditor]
  );
  return [handleEditorMount, editor];
};

// export const useEditorValue = (): [EditorDidMount, string?] => {
//   const [value, setValue] = React.useState();
//   const [handleEditorMount, editor] = useEditor();
//   React.useEffect(() => {
//     if (editor) {
//       editor.onDidChangeModelContent(() => {
//         setValue(editor.getValue());
//       });
//     }
//   }, [editor]);
//   return [handleEditorMount, value];
// };
