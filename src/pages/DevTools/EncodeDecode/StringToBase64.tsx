import { useState } from "react";
import { LongTextInput } from "../../../components/ui/LongTextInput";
import { Button } from "../../../components/ui/Button";
import { StringToBase64 } from "../../../tools/DevTools/base64toHex";
import { Copy } from "../../../components/ui/CopyIcon";
import { TwoColumnTemplate } from "../../../components/Templates/TwoColumnTemplate";

export const StringBase64 = () => {
  const [string, setString] = useState("");
  const [base64Text, setBase64Text] = useState("");
  const StringInputComponent = (
    <LongTextInput
      value={string}
      rows={10}
      onChange={(e: string) => {
        setString(e);
      }}
      placeholder="Enter string to be converted....."
    />
  );
  const Base64InputComponent = (
    <LongTextInput
      value={base64Text}
      onChange={(e: string) => {
        setBase64Text(e);
      }}
      placeholder="base64 string goes here..."
      copyComponent={<Copy text={base64Text} />}
    />
  );
  const ButtonComponent = (
    <Button
      title="Convert"
      onClick={() => {
        let base64 = StringToBase64(string);
        setBase64Text(base64);
      }}
      style={{
        width: "33.33%",
      }}
    />
  );
  return (
    <TwoColumnTemplate
      Column1={StringInputComponent}
      Column2={Base64InputComponent}
      ButtonComponent={ButtonComponent}
    />
  );
};
