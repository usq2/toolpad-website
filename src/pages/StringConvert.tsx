import { useState } from "react";
import { LongTextInput } from "../components/ui/LongTextInput";
import { Button } from "../components/ui/Button";
import { TopHeader } from "../components/HomePage/TopHeader";
import { StringToBase64, StringToHex } from "../tools/DevTools/base64toHex";
import { Copy } from "../components/ui/CopyIcon";

export const StringConvert = () => {
  const [string, setString] = useState("");
  const [base64Text, setBase64Text] = useState("");
  const [hexText, setHexText] = useState("");

  return (
    <div className="flex flex-col flex-grow">
      <div
        className="flex justify-center items-center"
        style={{ height: "15vh" }}
      >
        <span> Ad Goes Here</span>
      </div>
      <div className="flex flex-col w-full justify-center items-center h-auto">
        <div className="w-full p-4">
          <LongTextInput
            value={string}
            rows={3}
            onChange={(e: string) => {
              setString(e);
            }}
            placeholder="Enter string to be converted....."
          />
        </div>

        <Button
          title="Convert"
          onClick={(event) => {
            let hex = StringToHex(string);
            let base64 = StringToBase64(string);
            setHexText(hex);
            setBase64Text(base64);
          }}
          style={{
            width: "33.33%",
          }}
        />

        <div className="flex flex-row md:flex-col w-full">
          <div className="w-1/2 md:w-full p-4">
            <LongTextInput
              value={base64Text}
              onChange={(e: string) => {
                setBase64Text(e);
              }}
              placeholder="base64 string goes here..."
              copyComponent={<Copy text={base64Text} />}
            />
          </div>
          <div className="w-1/2 md:w-full p-4">
            <LongTextInput
              value={hexText}
              onChange={(e: string) => setHexText(e)}
              placeholder="Hex string goes here...."
              copyComponent={<Copy text={base64Text} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
