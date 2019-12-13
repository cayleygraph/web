import React, { useCallback, useState, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Typography } from "@rmwc/typography";
import "@material/typography/dist/mdc.typography.css";
import { Select } from "@rmwc/select";
import "@material/select/dist/mdc.select.css";
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";
import RunButton from "./RunButton";
import download from "downloadjs";
import { useEditor } from "./monaco-util";
import * as mime from "./mime";

type Props = {
  serverURL: string;
};

const write = (serverURL: string, value: string | File): Promise<Response> =>
  fetch(`${serverURL}/api/v2/write`, {
    method: "POST",
    body: value
  });

const runDelete = (serverURL: string, value: string): Promise<Response> =>
  fetch(`${serverURL}/api/v2/delete`, {
    method: "POST",
    body: value
  });

const read = (serverURL: string): Promise<Response> =>
  fetch(`${serverURL}/api/v2/read`, {
    headers: {
      Accept: mime.N_QUADS
    }
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFileMenu = useCallback(() => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.click();
    }
  }, [fileInputRef]);

  const handleFileInputChange = useCallback(
    event => {
      for (const file of event.currentTarget.files) {
        write(serverURL, file).then(() => {
          console.log(`Uploaded ${file.name}`);
        });
      }
    },
    [serverURL]
  );

  const downloadDump = useCallback(() => {
    read(serverURL)
      .then(res => res.blob())
      .then(blob => {
        download(blob, "data.nq", mime.N_QUADS);
      });
  }, []);

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />
      <main>
        <Typography use="headline6">Data</Typography>
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
          <Button
            icon="cloud_upload"
            label="Upload file"
            onClick={openFileMenu}
          />
          <Button
            icon="cloud_download"
            label="Download dump"
            onClick={downloadDump}
          />
        </div>
      </main>
    </>
  );
};

export default WritePage;
