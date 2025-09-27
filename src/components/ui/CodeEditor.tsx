import { FC, ReactNode, useState, useEffect } from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { xml } from "@codemirror/lang-xml";
import { indentOnInput, foldGutter } from "@codemirror/language";
import { eclipse } from "@uiw/codemirror-theme-eclipse";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { AppThemes, useTheme } from "../../hooks/useTheme";

export const CodeEditor: FC<{
  value: string | undefined;
  setValue: Function;
  language: "json" | "xml";
  copyComponent?: ReactNode;
}> = ({ value, setValue, language, copyComponent }) => {
  const { getTheme } = useTheme();

  const [theme, setTheme] = useState(() =>
    getTheme() === AppThemes.DARK ? dracula : eclipse
  );
  useEffect(() => {
    const ThemeChangeHandler = (event: Event) => {
      const appTheme = (event as CustomEvent).detail;
      if (appTheme === AppThemes.DARK) {
        setTheme(dracula);
      } else {
        setTheme(eclipse);
      }
    };

    document.addEventListener("ThemeChangeEvent", ThemeChangeHandler);
    return () => {
      document.removeEventListener("ThemeChangeEvent", ThemeChangeHandler);
    };
  });

  return (
    <>
      <div className="flex flex-1 flex-col w-full h-full items-end dark:bg-[#282a36]">
        <CodeMirror
          className="h-[95%] w-full"
          value={value}
          theme={theme}
          minHeight="100%"
          maxHeight="100%"
          extensions={[
            language === "json" ? json() : xml(),
            indentOnInput(),
            foldGutter(), // adds fold gutter
            EditorView.lineWrapping,
          ]}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
            autocompletion: true,
          }}
          editable={true}
          style={{
            overflow: "auto",
            maxHeight: window.innerWidth > 768 ? "75vh" : "50vh",
            maxWidth: window.innerWidth > 768 ? "70vw" : "100vw",
          }}
          onChange={(value) => {
            setValue(value);
          }}
        />
        {copyComponent}
      </div>
    </>
  );
};
