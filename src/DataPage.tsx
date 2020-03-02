import React, { useCallback, useState, useRef } from "react";
import { Snackbar } from "@rmwc/snackbar";
import "@material/snackbar/dist/mdc.snackbar.css";
import "@material/button/dist/mdc.button.css";
import MonacoEditor from "@monaco-editor/react";
import { Typography } from "@rmwc/typography";
import "@material/typography/dist/mdc.typography.css";
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";
import RunButton from "./RunButton";
import download from "downloadjs";
import { useEditor, DEFAULT_OPTIONS, theme } from "./monaco-util";
import * as mime from "./mime";
import "./Query/QueryPage.css";
import { ModeSelect, Mode } from "./ModeSelect";

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

const WritePage = ({ serverURL }: Props) => {
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [mode, setMode] = useState(Mode.write);
  const [handleEditorMount, editor] = useEditor();

  const unsetSnackbarMessage = useCallback(() => {
    setSnackbarMessage(null);
  }, [setSnackbarMessage]);

  const handleRunButtonClick = useCallback(() => {
    if (!editor) {
      return;
    }
    const value = editor.getValue();
    switch (mode) {
      case "write": {
        write(serverURL, value).catch(error => {
          setSnackbarMessage(error.toString());
        });
        return;
      }
      case "delete": {
        runDelete(serverURL, value).catch(error => {
          setSnackbarMessage(error.toString());
        });
        return;
      }
      default: {
        throw new Error(`Unexpected mode ${mode}`);
      }
    }
  }, [serverURL, editor, mode]);

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
        write(serverURL, file)
          .then(() => {
            setSnackbarMessage(`Uploaded ${file.name}`);
          })
          .catch(error => {
            setSnackbarMessage(error.toString());
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
      })
      .catch(error => {
        setSnackbarMessage(error.toString());
      });
  }, [serverURL]);

  return (
    <>
      <Snackbar
        open={snackbarMessage !== null}
        onClose={unsetSnackbarMessage}
        message={snackbarMessage}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />
      <main className="QueryPage DataPage">
        <Typography use="headline6">Data</Typography>
        <MonacoEditor
          editorDidMount={handleEditorMount}
          language="nquads"
          theme={theme}
          options={DEFAULT_OPTIONS}
        />
        <div className="actions">
          <RunButton onClick={handleRunButtonClick} />
          <ModeSelect value={mode} onChange={setMode} />
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
