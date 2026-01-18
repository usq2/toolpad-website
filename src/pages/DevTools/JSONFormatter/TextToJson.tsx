import { useState } from "react";
import { LongTextInput } from "../../../components/ui/LongTextInput";
import { Button } from "../../../components/ui/Button";
import { TwoColumnTemplate } from "../../../components/Templates/TwoColumnTemplate";
import { CodeEditor } from "../../../components/ui/CodeEditor";
import { Copy } from "../../../components/ui/CopyIcon";

export const TextToJSONFormatter = () => {
  const [jsonText, setJSONText] = useState("");
  const [formatted, setFormatted] = useState("");
  return (
    <TwoColumnTemplate
      header={"Text to JSON"}
      subHeader="Convert a JSON string to JSON"
      Column1={
        <div className="w-full md:w-1/3 h-full">
          <LongTextInput
            value={jsonText}
            rows={3}
            onChange={(e: string) => {
              setJSONText(e);
            }}
            placeholder="Enter string to be converted....."
          />
        </div>
      }
      Column2={
        <CodeEditor
          value={formatted}
          setValue={setFormatted}
          language="json"
          copyComponent={<Copy text={jsonText} />}
        />
      }
      ButtonComponent={
        <Button
          title="Convert"
          onClick={() => {
            try {
              let formatted = JSON.parse(jsonText);
              formatted = JSON.stringify(formatted, null, 2);
            } catch (error) {
              setFormatted(JSON.stringify(error.message));
            }
          }}
          style={{
            width: "33.33%",
          }}
        />
      }
    />
  );
};
