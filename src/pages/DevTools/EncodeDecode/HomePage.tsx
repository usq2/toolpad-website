import { TopHeader } from "../../../components/HomePage/TopHeader";
import { SideMenu } from "../../../components/ui/SideMenu";
import { Outlet, NavigateFunction } from "react-router-dom";

export const EncodeDecodeHomePage = () => {
  //links are based on routes object
  return (
    <div className="flex flex-col max-h-screen">
      <TopHeader />
      <div className="flex flex-row h-lvh">
        <SideMenu
          Links={[
            {
              label: "String To Base64",
              onClick: (navigate: NavigateFunction) => {
                navigate("string-to-base64");
              },
            },
            {
              label: "String To Hex",
              onClick: (navigate: NavigateFunction) => {
                navigate("string-to-hex");
              },
            },
            {
              label: "File To Base64",
              onClick: (navigate: NavigateFunction) => {
                navigate("file-to-base64");
              },
            },
            {
              label: "File To Hex",
              onClick: (navigate: NavigateFunction) => {
                navigate("file-to-hex");
              },
            },
            {
              label: "Base64 To Hex",
              onClick: (navigate: NavigateFunction) => {
                navigate("base64-to-hex");
              },
            },
            {
              label: "Base64 To String",
              onClick: (navigate: NavigateFunction) => {
                navigate("string-to-base64");
              },
            },
            {
              label: "Hex To Base64",
              onClick: (navigate: NavigateFunction) => {
                navigate("hex-to-base64");
              },
            },
            {
              label: "Hex To String",
              onClick: (navigate: NavigateFunction) => {
                navigate("hex-to-string");
              },
            },
          ]}
        />
        <div className="flex flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
