import { BaseSyntheticEvent, useState } from "react";
import { LongTextInput } from "../../../components/ui/LongTextInput";
import { Copy } from "../../../components/ui/CopyIcon";
import { ConvertFileToBase64 } from "../../../tools/DevTools/FileToBase64Hex";
import FileUpload from "../../../components/ui/FileUpload";
import { TwoColumnTemplate } from "../../../components/Templates/TwoColumnTemplate";

export const FileBase64 = () => {
  const [base64Text, setBase64Text] = useState("");

  const convert = async (file: File | Blob) => {
    if (file) {
      const base64String = await ConvertFileToBase64(file);
      setBase64Text(base64String as string); // Includes the MIME type
    }
  };
  async function ReadFile(event: BaseSyntheticEvent) {
    const file = event.target.files[0];
    await convert(file);
  }
  async function ReadURL(event: BaseSyntheticEvent) {
    const file = event.target.value;
    const response = await fetch(file);
    const blob = await response.blob();

    await convert(blob);
  }

  const FileComponent = (
    <FileUpload
      onFileChange={async (e: BaseSyntheticEvent) => await ReadFile(e)}
      onUrlChange={async (e: BaseSyntheticEvent) => await ReadURL(e)}
    />
  );
  const Base64Component = (
    <LongTextInput
      value={base64Text}
      onChange={(e: string) => {
        setBase64Text(e);
      }}
      placeholder="base64 string goes here..."
      copyComponent={<Copy text={base64Text} />}
    />
  );
  return (
    <TwoColumnTemplate
      header={"File to Base64"}
      subHeader="Convert file contents to a base64 encoded string"
      Column1={FileComponent}
      Column2={Base64Component}
      ButtonComponent={null}
    />
  );
};
