import React, { useState, useCallback, useEffect } from "react";
// eslint-disable-next-
import * as monaco from "monaco-editor";
import { monaco as monacoInit } from "@monaco-editor/react";
import MonacoEditor from "@monaco-editor/react";
import { languageOptions, Language } from "./queries";
import { Typography } from "@rmwc/typography";
import "@material/typography/dist/mdc.typography.css";
import { Select } from "@rmwc/select";
import "@material/select/dist/mdc.select.css";
import { useTimer } from "use-timer";
import RunButton from "./RunButton";
import { useEditor } from "./monaco-util";
import { setLastQuery, getLastQuery } from "./lastQuery";

// Setup monaco to use local monaco instead of CDN
monacoInit.config({
  urls: {
    monacoLoader: "/vs/loader.js",
    monacoBase: "/vs"
  }
});

const formatQueryTime = (queryTime: number): string => {
  if (queryTime < 100) {
    return `${queryTime} milliseconds`;
  }
  return `${(queryTime / 1000).toFixed(2)} seconds`;
};

const queryLanguageToMonacoLanguage = (
  language: Language | undefined
): string => {
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
    case undefined: {
      return "text";
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

const options: monaco.editor.IDiffEditorConstructionOptions = {
  minimap: { enabled: false }
};

type Props = {
  onRun: (query: string, language: Language, onDone: () => void) => void;
};

const QueryEditor = ({ onRun }: Props) => {
  const [onEditorMount, editor] = useEditor();
  const [language, setLanguage] = useState();
  const { time, start, pause, reset } = useTimer({
    interval: 1
  });

  const setValue = useCallback(
    (value: string) => {
      editor?.setValue(value);
    },
    [editor]
  );

  const handleEditorMount = useCallback(
    (_, editor) => {
      onEditorMount(_, editor);
    },
    [onEditorMount]
  );

  const handleLanguageChange = useCallback(
    (event: any) => {
      setLanguage(event.target.value);
    },
    [setLanguage]
  );

  const run = useCallback(() => {
    if (editor) {
      reset();
      start();
      onRun(editor.getValue(), language, pause);
    }
  }, [editor, language, onRun, reset, start, pause]);

  // Set initial value for language based on lastQuery
  useEffect(() => {
    const lastQuery = getLastQuery();
    setLanguage(lastQuery.language);
  }, [setLanguage]);

  useEffect(() => {
    if (editor) {
      registerRunShortcut(editor, run);
    }
  }, [editor, run]);

  useEffect(() => {
    let didChangeModelContentDisposable: monaco.IDisposable | null = null;
    if (editor && language) {
      setValue(getLastQuery(language).text);
      didChangeModelContentDisposable = editor.onDidChangeModelContent(() => {
        setLastQuery({
          text: editor.getValue(),
          language
        });
      });
    }
    return () => {
      if (didChangeModelContentDisposable) {
        didChangeModelContentDisposable.dispose();
      }
      if (editor) {
        setLastQuery({
          text: editor.getValue(),
          language
        });
      }
    };
  }, [editor, language, setValue]);

  return (
    <div className="QueryEditor">
      <Typography use="headline6">Query Editor</Typography>
      <MonacoEditor
        height={300}
        editorDidMount={handleEditorMount}
        language={queryLanguageToMonacoLanguage(language)}
        options={options}
        value={null}
      />
      <div className="actions">
        <RunButton onClick={run} />
        <Select
          outlined
          options={languageOptions}
          value={language}
          onChange={handleLanguageChange}
        />
        <span className="timer">
          {time ? `${formatQueryTime(time)} elapsed` : null}
        </span>
      </div>
    </div>
  );
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

initMonaco();

export default QueryEditor;
