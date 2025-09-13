import { useState } from "react";
import { LongTextInput } from "../components/ui/LongTextInput";
import { Button } from "../components/ui/Button";
import { TopHeader } from "../components/HomePage/TopHeader";
import { Base64ToHex, HexToBase64 } from "../tools/DevTools/base64toHex";
import { Copy } from "../components/ui/CopyIcon";
import SideMenu from "../components/ui/SideMenu";

export const Base64ToHexpage = () => {
  const [base64Text, setBase64Text] = useState("");
  const [hexText, setHexText] = useState("");

  return (
    <>
      <TopHeader />
      <SideMenu />
      <div
        className="flex justify-center items-center"
        style={{ height: "15vh" }}
      >
        <span> Ad Goes Here</span>
      </div>
      <div
        className="flex flex-col md:flex-row w-full"
        style={{ height: "66.67vh" }}
      >
        {/* Left Column - 40% */}
        <div className="w-full md:w-2/5 p-4">
          <LongTextInput
            value={base64Text}
            onChange={(e: string) => {
              setBase64Text(e);
            }}
            placeholder="Base 64 string goes here...."
            copyComponent={<Copy text={base64Text} />}
          />
        </div>

        {/* Middle Column - 20% */}
        <div className="w-full md:w-1/5 flex flex-row md:flex-col justify-center items-center space-x-4 md:space-x-0 md:space-y-4 p-4">
          <Button
            title="Base64 To Hex"
            onClick={(event) => {
              let hex = Base64ToHex(base64Text);
              setHexText(hex);
            }}
          />
          <Button
            title="Hex to Base64"
            onClick={(event) => {
              let base64 = HexToBase64(hexText);
              setBase64Text(base64);
            }}
          />
        </div>

        {/* Right Column - 40% */}
        <div className="w-full md:w-2/5 p-4">
          <LongTextInput
            value={hexText}
            onChange={(e: string) => setHexText(e)}
            placeholder="Hex string goes here...."
            copyComponent={<Copy text={base64Text} />}
          />
        </div>
      </div>
    </>
  );
};
