import React, { useCallback } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Typography } from "@rmwc/typography";
import "@material/typography/dist/mdc.typography.css";
import RunButton from "./RunButton";
import { useEditor } from "./monaco-util";

type Props = {
  serverURL: string;
};

const write = (serverURL: string, value: string): Promise<Response> =>
  fetch(`${serverURL}/api/v2/write`, {
    method: "POST",
    body: value
  });

const WritePage = ({ serverURL }: Props) => {
  const [handleEditorMount, editor] = useEditor();
  const handleRunButtonClick = useCallback(() => {
    write(serverURL, editor.getValue());
  }, [serverURL, editor]);
  return (
    <main>
      <Typography use="headline6">Write</Typography>
      <MonacoEditor
        editorDidMount={handleEditorMount}
        language="nquads"
        options={{ minimap: { enabled: false } }}
      />
      <div className="actions">
        <RunButton onClick={handleRunButtonClick} />
      </div>
    </main>
  );
};

export default WritePage;
