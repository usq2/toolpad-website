import { useState } from "react";
import { LongTextInput } from "../../../components/ui/LongTextInput";
import { Copy } from "../../../components/ui/CopyIcon";
import { ConvertFileToHex } from "../../../tools/DevTools/FileToBase64Hex";
import FileUpload from "../../../components/ui/FileUpload";
import { TwoColumnTemplate } from "../../../components/Templates/TwoColumnTemplate";

export const FileHex = () => {
  const [hexText, setHexText] = useState("");

  const convert = async (file) => {
    if (file) {
      const hexString = await ConvertFileToHex(file);
      setHexText(hexString as string); // Includes the MIME type
    }
  };
  async function ReadFile(event) {
    const file = event.target.files[0];
    await convert(file);
  }
  async function ReadURL(event) {
    const file = event.target.value;
    const response = await fetch(file);
    const blob = await response.blob();

    await convert(blob);
  }
  const FileComponent = (
    <FileUpload
      onFileChange={async (e) => await ReadFile(e)}
      onUrlChange={async (e) => await ReadURL(e)}
    />
  );
  const HexInput = (
    <LongTextInput
      value={hexText}
      onChange={(e: string) => {
        setHexText(e);
      }}
      placeholder="Hex string goes here..."
      copyComponent={<Copy text={setHexText} />}
    />
  );
  return (
    <TwoColumnTemplate
      Column1={FileComponent}
      Column2={HexInput}
      ButtonComponent={null}
    />
  );
};
