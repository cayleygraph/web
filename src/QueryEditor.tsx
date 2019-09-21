import React, { useState, useCallback, useEffect } from "react";
// eslint-disable-next-line
import * as monaco from "monaco-editor";
import { monaco as monacoInit } from "@monaco-editor/react";
import MonacoEditor from "@monaco-editor/react";
import { languageOptions, Language } from "./queries";
import { Typography } from "@rmwc/typography";
import "@material/typography/dist/mdc.typography.css";
import { Select } from "@rmwc/select";
import "@material/select/dist/mdc.select.css";
import RunButton from "./RunButton";
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

const getGizmoDefinitions = async (): [string, string] => {
  const gizmoPath = `${process.env.PUBLIC_URL}/gizmo.d.ts`;
  const res = await fetch(gizmoPath);
  const content = await res.text();
  return [content, gizmoPath];
};

async function initMonaco() {
  const [content, path] = await getGizmoDefinitions();
  const monacoInstance = await monacoInit.init();
  const {
    javascriptDefaults,
    ScriptTarget
  } = monacoInstance.languages.typescript;
  javascriptDefaults.setCompilerOptions({
    noLib: true,
    target: ScriptTarget.ES5,
    allowNonTsExtensions: true
  });
  javascriptDefaults.addExtraLib(content, path);
}

initMonaco();

const QueryEditor = ({
  onRun
}: {
  onRun: (query: string, language: Language) => void;
}) => {
  const [handleEditorMount, editor] = useEditor();
  const [language, setLanguage] = useState(languageOptions[0].value);
  const options: monaco.editor.IDiffEditorConstructionOptions = {
    minimap: { enabled: false }
  };

  const handleLanguageChange = React.useCallback(
    (event: any) => {
      setLanguage(event.target.value);
    },
    [setLanguage]
  );

  const handleRunButtonClick = useCallback(() => {
    if (editor) {
      onRun(editor.getValue(), language);
    }
  }, [editor, language, onRun]);

  return (
    <div className="QueryEditor">
      <Typography use="headline6">Query Editor</Typography>
      <MonacoEditor
        height={300}
        editorDidMount={handleEditorMount}
        language={queryLanguageToMonacoLanguage(language)}
        options={options}
      />
      <div className="actions">
        <RunButton onClick={handleRunButtonClick} />
        <Select
          outlined
          options={languageOptions}
          value={language}
          onChange={handleLanguageChange}
        />
      </div>
    </div>
  );
};

export default QueryEditor;
