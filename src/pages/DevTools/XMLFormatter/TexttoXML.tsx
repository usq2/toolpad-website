import { BaseSyntheticEvent, useState } from "react";
import { LongTextInput } from "../../../components/ui/LongTextInput";
import { Button } from "../../../components/ui/Button";
import { TwoColumnTemplate } from "../../../components/Templates/TwoColumnTemplate";
import { CodeEditor } from "../../../components/ui/CodeEditor";
import { Copy } from "../../../components/ui/CopyIcon";
import { FormatXml } from "../../../tools/DevTools/XmlFormatter";

export const TextToXMLFormatter = () => {
  const [xmlText, setXmlText] = useState("");
  const [formattedXMl, setFormattedXml] = useState("");

  return (
    <TwoColumnTemplate
      Column1={
        <div className="w-full md:w-1/3 h-full">
          <LongTextInput
            value={xmlText}
            rows={3}
            onChange={(e: string) => {
              setXmlText(e);
            }}
            placeholder="Enter string to be converted....."
          />
        </div>
      }
      Column2={
        <CodeEditor
          value={formattedXMl}
          setValue={setFormattedXml}
          language="xml"
          copyComponent={<Copy text={formattedXMl} />}
        />
      }
      ButtonComponent={
        <Button
          title="Convert"
          onClick={() => {
            let formatted = FormatXml(xmlText);
            setFormattedXml(formatted);
          }}
          style={{
            width: "33.33%",
          }}
        />
      }
    />
  );
};
