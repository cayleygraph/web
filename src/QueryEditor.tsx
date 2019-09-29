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

const getGizmoDefinitions = async (): Promise<[string, string]> => {
  const gizmoPath = `${process.env.PUBLIC_URL}/gizmo.d.ts`;
  const res = await fetch(gizmoPath);
  const content = await res.text();
  return [content, gizmoPath];
};

async function initMonaco(): Promise<void> {
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

async function registerRunShortcut(
  editor: monaco.editor.IStandaloneCodeEditor,
  run: () => void
): Promise<void> {
  if (!editor) {
    return;
  }
  const monacoInstance = await monacoInit.init();
  editor.addAction({
    // An unique identifier of the contributed action.
    id: "cayley-run",

    // A label of the action that will be presented to the user.
    label: "Run",

    // An optional array of keybindings for the action.
    keybindings: [monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter],

    run: () => {
      run();
    }
  });
}

const QueryEditor = ({
  onRun,
  lastQuery,
  onLastQueryChange
}: {
  onRun: (query: string, language: Language) => void;
  lastQuery: string | null;
  onLastQueryChange: (query: string) => void;
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

  const run = useCallback(() => {
    if (editor) {
      onRun(editor.getValue(), language);
    }
  }, [editor, language, onRun]);

  useEffect(() => {
    initMonaco();
  }, []);

  useEffect(() => {
    if (editor) {
      registerRunShortcut(editor, run);
    }
  }, [editor, run]);

  useEffect(() => {
    if (lastQuery && editor) {
      editor.setValue(lastQuery);
    }
    return () => {
      if (editor) {
        return onLastQueryChange(editor.getValue());
      }
    };
  }, [editor]);

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
        <RunButton onClick={run} />
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
