import { BaseSyntheticEvent, useState } from "react";
import FileUpload from "../../../components/ui/FileUpload";
import { TwoColumnTemplate } from "../../../components/Templates/TwoColumnTemplate";
import { CodeEditor } from "../../../components/ui/CodeEditor";
import { Copy } from "../../../components/ui/CopyIcon";
export const JSONFormatter = () => {
  const [jsonText, setJSONText] = useState("");
  function readXmlFile(file: any, callback: any) {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target!.result);
    reader.readAsText(file);
  }
  const handleFileChange = (e: BaseSyntheticEvent) => {
    const file = e.target.files[0];
    if (file) {
      readXmlFile(file, jsonText);
    }
  };
  return (
    <TwoColumnTemplate
      Column1={
        <FileUpload
          onFileChange={(e: BaseSyntheticEvent) => handleFileChange(e)}
          onUrlChange={(e: BaseSyntheticEvent) => handleFileChange(e)}
        />
      }
      Column2={
        <CodeEditor
          value={jsonText}
          setValue={setJSONText}
          language="json"
          copyComponent={<Copy text={jsonText} />}
        />
      }
      ButtonComponent={null}
    />
  );
};
