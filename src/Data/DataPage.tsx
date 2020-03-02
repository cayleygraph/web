import React, { useCallback, useState } from "react";
import { Snackbar } from "@rmwc/snackbar";
import "@material/snackbar/dist/mdc.snackbar.css";
import "@material/button/dist/mdc.button.css";
import MonacoEditor from "@monaco-editor/react";
import { Typography } from "@rmwc/typography";
import "@material/typography/dist/mdc.typography.css";
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";
import RunButton from "../RunButton";
import download from "downloadjs";
import { useEditor, DEFAULT_OPTIONS, theme } from "../monaco-util";
import * as mime from "../mime";
import { write, runDelete, read } from "./data";
import "../Query/QueryPage.css";
import { ModeSelect, Mode } from "./ModeSelect";
import { useFileMenu } from "./use-file-menu";

type Props = {
  serverURL: string;
};

function run(serverURL: string, mode: Mode, value: string) {
  switch (mode) {
    case Mode.write: {
      return write(serverURL, value);
    }
    case Mode.delete: {
      return runDelete(serverURL, value);
    }
    default: {
      throw new Error(`Unexpected mode ${mode}`);
    }
  }
}

const DataPage = ({ serverURL }: Props) => {
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
    run(serverURL, mode, value).catch(error => {
      setSnackbarMessage(error.toString());
    });
  }, [serverURL, editor, mode]);

  const handleFilesChange = useCallback(
    files => {
      for (const file of files) {
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

  const [fileInput, openFileMenu] = useFileMenu(handleFilesChange);

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
      {fileInput}
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

export default DataPage;
