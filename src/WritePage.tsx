import React, { useCallback, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Typography } from "@rmwc/typography";
import "@material/typography/dist/mdc.typography.css";
import { Select } from "@rmwc/select";
import "@material/select/dist/mdc.select.css";
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

const runDelete = (serverURL: string, value: string): Promise<Response> =>
  fetch(`${serverURL}/api/v2/delete`, {
    method: "POST",
    body: value
  });

const options = [
  { label: "Write", value: "write" },
  { label: "Delete", value: "delete" }
];

const WritePage = ({ serverURL }: Props) => {
  const [mode, setMode] = useState(options[0].value);
  const [handleEditorMount, editor] = useEditor();
  const handleRunButtonClick = useCallback(() => {
    if (!editor) {
      return;
    }
    const value = editor.getValue();
    switch (mode) {
      case "write": {
        write(serverURL, value);
        return;
      }
      case "delete": {
        runDelete(serverURL, value);
        return;
      }
      default: {
        throw new Error(`Unexpected mode ${mode}`);
      }
    }
  }, [serverURL, editor, mode]);
  const handleModeChange = useCallback(
    event => {
      setMode(event.target.value);
    },
    [setMode]
  );
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
        <Select
          outlined
          options={options}
          value={mode}
          onChange={handleModeChange}
        />
      </div>
    </main>
  );
};

export default WritePage;
