import { useState } from "react";
import { LongTextInput } from "../../../components/ui/LongTextInput";
import { Button } from "../../../components/ui/Button";
import { Copy } from "../../../components/ui/CopyIcon";
import { Base64ToString } from "../../../tools/DevTools/base64toHex";
import { TwoColumnTemplate } from "../../../components/Templates/TwoColumnTemplate";

export const Base64String = () => {
  const [string, setString] = useState("");
  const [base64Text, setBase64Text] = useState("");
  const Base64Component = (
    <LongTextInput
      value={base64Text}
      onChange={(e: string) => {
        setBase64Text(e);
      }}
      placeholder="base64 string goes here..."
    />
  );
  const StringComponent = (
    <LongTextInput
      value={string}
      onChange={(e: string) => setString(e)}
      placeholder="String goes here...."
      copyComponent={<Copy text={string} />}
    />
  );
  const ButtonComponent = (
    <Button
      title="Convert"
      onClick={() => {
        let stringVal = Base64ToString(base64Text);
        setString(stringVal);
      }}
      style={{
        width: "33.33%",
      }}
    />
  );
  return (
    <TwoColumnTemplate
      header={"Base64 to String"}
      subHeader="Decode a base64 encoded string"
      Column1={StringComponent}
      Column2={Base64Component}
      ButtonComponent={ButtonComponent}
    />
  );
};
