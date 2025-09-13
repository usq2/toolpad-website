import { useState } from "react";
import { LongTextInput } from "../../../components/ui/LongTextInput";
import { Button } from "../../../components/ui/Button";
import { StringToHex } from "../../../tools/DevTools/base64toHex";
import { Copy } from "../../../components/ui/CopyIcon";
import { TwoColumnTemplate } from "../../../components/Templates/TwoColumnTemplate";
export const StringHex = () => {
  const [string, setString] = useState("");
  const [hexText, setHexText] = useState("");

  const StringInputComponent = (
    <LongTextInput
      value={string}
      rows={3}
      onChange={(e: string) => {
        setString(e);
      }}
      placeholder="Enter string to be converted....."
    />
  );
  const HexInputComponent = (
    <LongTextInput
      value={hexText}
      onChange={(e: string) => {
        setHexText(e);
      }}
      placeholder="hex string goes here..."
      copyComponent={<Copy text={hexText} />}
    />
  );
  const ButtonComponent = (
    <Button
      title="Convert"
      onClick={(event) => {
        let hex = StringToHex(string);
        setHexText(hex);
      }}
      style={{
        width: "33.33%",
      }}
    />
  );
  return (
    <TwoColumnTemplate
      Column1={StringInputComponent}
      Column2={HexInputComponent}
      ButtonComponent={ButtonComponent}
    />
  );
};
