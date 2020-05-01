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
import { write, runDelete, read, ContentType } from "./data";
import "../Query/QueryPage.css";
import { ModeSelect, Mode } from "./ModeSelect";
import { ContentTypeSelect } from "./ContentTypeSelect";
import { useFileMenu } from "./use-file-menu";

type Props = {
  serverURL: string;
};

function run(
  serverURL: string,
  mode: Mode,
  contentType: ContentType,
  value: string
) {
  switch (mode) {
    case Mode.write: {
      return write(serverURL, contentType, value);
    }
    case Mode.delete: {
      return runDelete(serverURL, contentType, value);
    }
    default: {
      throw new Error(`Unexpected mode ${mode}`);
    }
  }
}

function contentTypeToLanguage(contentType: string): string {
  switch (contentType) {
    case mime.JSON_LD: {
      return "json";
    }
    case mime.N_QUADS: {
      return "nquads";
    }
    default: {
      throw new Error(`Unknown content type ${contentType}`);
    }
  }
}

/**
 * @todo keyboard shortcut to run
 * @todo snackbar indication for successful write
 */
const DataPage = ({ serverURL }: Props) => {
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [mode, setMode] = useState(Mode.write);
  const [contentType, setContentType] = useState(mime.JSON_LD);
  const [handleEditorMount, editor] = useEditor();

  const unsetSnackbarMessage = useCallback(() => {
    setSnackbarMessage(null);
  }, [setSnackbarMessage]);

  const handleRunButtonClick = useCallback(() => {
    if (!editor) {
      return;
    }
    const value = editor.getValue();
    run(serverURL, mode, contentType, value).catch((error) => {
      setSnackbarMessage(error.toString());
    });
  }, [serverURL, editor, mode, contentType]);

  const handleFilesChange = useCallback(
    (files) => {
      for (const file of files) {
        write(serverURL, contentType, file)
          .then(() => {
            setSnackbarMessage(`Uploaded ${file.name}`);
          })
          .catch((error) => {
            setSnackbarMessage(error.toString());
          });
      }
    },
    [serverURL, contentType]
  );

  const [fileInput, openFileMenu] = useFileMenu(handleFilesChange);

  const downloadDump = useCallback(() => {
    read(serverURL, contentType)
      .then((res) => res.blob())
      .then((blob) => {
        download(blob, "data.nq", mime.N_QUADS);
      })
      .catch((error) => {
        setSnackbarMessage(error.toString());
      });
  }, [serverURL, contentType]);

  return (
    <>
      <Snackbar
        open={snackbarMessage !== null}
        onClose={unsetSnackbarMessage}
        message={snackbarMessage}
      />
      {fileInput}
      <main className="QueryPage vertical">
        <div className="query-editor-group">
          <Typography use="headline6">Data</Typography>
          <MonacoEditor
            loading={null}
            value={null}
            editorDidMount={handleEditorMount}
            language={contentTypeToLanguage(contentType)}
            theme={theme}
            options={DEFAULT_OPTIONS}
          />
          <div className="actions">
            <RunButton onClick={handleRunButtonClick} />
            <ModeSelect value={mode} onChange={setMode} />
            <ContentTypeSelect value={contentType} onChange={setContentType} />
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
        </div>
      </main>
    </>
  );
};

export default DataPage;
