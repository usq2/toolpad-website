import { useState } from "react";
import { LongTextInput } from "../../../components/ui/LongTextInput";
import { Copy } from "../../../components/ui/CopyIcon";
import { ConvertFileToBase64 } from "../../../tools/DevTools/FileToBase64Hex";
import FileUpload from "../../../components/ui/FileUpload";
import { TwoColumnTemplate } from "../../../components/Templates/TwoColumnTemplate";

export const FileBase64 = () => {
  const [base64Text, setBase64Text] = useState("");

  const convert = async (file) => {
    if (file) {
      const base64String = await ConvertFileToBase64(file);
      console.log(base64String);
      setBase64Text(base64String as string); // Includes the MIME type
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
      Column1={FileComponent}
      Column2={Base64Component}
      ButtonComponent={null}
    />
  );
};
