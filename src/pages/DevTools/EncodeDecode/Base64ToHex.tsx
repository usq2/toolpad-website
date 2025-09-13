import { useState } from "react";
import { LongTextInput } from "../../../components/ui/LongTextInput";
import { Button } from "../../../components/ui/Button";
import { Copy } from "../../../components/ui/CopyIcon";
import { Base64ToHex } from "../../../tools/DevTools/base64toHex";
import { TwoColumnTemplate } from "../../../components/Templates/TwoColumnTemplate";

export const Base64Hex = () => {
  const [base64Text, setBase64Text] = useState("");
  const [hexText, setHexText] = useState("");
  const Base64Component = (
    <LongTextInput
      value={base64Text}
      onChange={(e: string) => {
        setBase64Text(e);
      }}
      placeholder="base64 string goes here..."
    />
  );
  const HexComponent = (
    <LongTextInput
      value={hexText}
      onChange={(e: string) => setHexText(e)}
      placeholder="Hex string goes here...."
      copyComponent={<Copy text={base64Text} />}
    />
  );
  const ButtonComponent = (
    <Button
      title="Convert"
      onClick={(event) => {
        let hex = Base64ToHex(base64Text);
        setHexText(hex);
      }}
      style={{
        width: "33.33%",
      }}
    />
  );
  return (
    <TwoColumnTemplate
      Column1={Base64Component}
      Column2={HexComponent}
      ButtonComponent={ButtonComponent}
    />
  );
};
