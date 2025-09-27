import { useState } from "react";
import { LongTextInput } from "../../../components/ui/LongTextInput";
import { Button } from "../../../components/ui/Button";
import { Copy } from "../../../components/ui/CopyIcon";
import { HexToBase64 } from "../../../tools/DevTools/base64toHex";
import { TwoColumnTemplate } from "../../../components/Templates/TwoColumnTemplate";

export const HexBase64 = () => {
  const [base64Text, setBase64Text] = useState("");
  const [hexText, setHexText] = useState("");

  const HexComponent = (
    <LongTextInput
      value={base64Text}
      onChange={(e: string) => {
        setHexText(e);
      }}
      placeholder="Hex string goes here..."
    />
  );
  const Base64Component = (
    <LongTextInput
      value={hexText}
      onChange={(e: string) => setBase64Text(e)}
      placeholder="base64 string goes here...."
      copyComponent={<Copy text={base64Text} />}
    />
  );
  const ButtonComponent = (
    <Button
      title="Convert"
      onClick={() => {
        let hex = HexToBase64(base64Text);
        setHexText(hex);
      }}
      style={{
        width: "33.33%",
      }}
    />
  );
  return (
    <TwoColumnTemplate
      Column1={HexComponent}
      Column2={Base64Component}
      ButtonComponent={ButtonComponent}
    />
  );
};
