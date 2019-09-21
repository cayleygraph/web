import React, { useState, useCallback } from "react";
import { editor } from "monaco-editor";
import MonacoEditor from "@monaco-editor/react";
import { languageOptions, Language } from "./queries";
import { Typography } from "@rmwc/typography";
import "@material/typography/dist/mdc.typography.css";
import { Select } from "@rmwc/select";
import "@material/select/dist/mdc.select.css";
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";
import { useEditor } from "./monaco-util";

const queryLanguageToMonacoLanguage = (language: Language): string => {
  switch (language) {
    case "gizmo": {
      return "javascript";
    }
    case "graphql": {
      return "graphql";
    }
    case "mql": {
      return "json";
    }
    default: {
      throw new Error(`Unexpected value ${language}`);
    }
  }
};

const QueryEditor = ({
  onRun
}: {
  onRun: (query: string, language: Language) => void;
}) => {
  const [handleEditorMount, editor] = useEditor();
  const [language, setLanguage] = useState(languageOptions[0].value);
  const options: editor.IDiffEditorConstructionOptions = {
    minimap: { enabled: false }
  };

  const handleLanguageChange = React.useCallback(
    (event: any) => {
      setLanguage(event.target.value);
    },
    [setLanguage]
  );

  const handleRunButtonClick = useCallback(() => {
    onRun(editor.getValue(), language);
  }, [editor, language, onRun]);

  return (
    <>
      <Typography use="headline6">Query Editor</Typography>
      <MonacoEditor
        height={300}
        editorDidMount={handleEditorMount}
        language={queryLanguageToMonacoLanguage(language)}
        options={options}
      />
      <div className="actions">
        <Button
          icon="play_circle_filled"
          unelevated
          label="Run"
          onClick={handleRunButtonClick}
        />
        <Select
          outlined
          options={languageOptions}
          value={language}
          onChange={handleLanguageChange}
        />
      </div>
    </>
  );
};

export default QueryEditor;
