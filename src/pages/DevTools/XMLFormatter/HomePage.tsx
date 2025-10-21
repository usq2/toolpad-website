import { TopHeader } from "../../../components/HomePage/TopHeader";
import { SideMenu } from "../../../components/ui/SideMenu";
import { NavigateFunction, Outlet } from "react-router-dom";

export const XMLFormatterHomePage = () => {
  //links are based on routes object
  return (
    <div className="flex flex-col max-h-screen">
      <TopHeader />
      <div className="flex flex-row h-lvh">
        <SideMenu
          Links={[
            {
              label: "Read XML From File",
              onClick: (navigate: NavigateFunction) => {
                navigate("read-xml-from-file");
              },
              link: "read-xml-from-file",
            },
            {
              label: "Read XML From Text",
              onClick: (navigate: NavigateFunction) => {
                navigate("read-xml-from-text");
              },
              link: "read-xml-from-text",
            },
            {
              label: "Read JSON From Text",
              onClick: (navigate: NavigateFunction) => {
                navigate("read-json-from-text");
              },
              link: "read-json-from-text",
            },
            {
              label: "Read JSON From File",
              onClick: (navigate: NavigateFunction) => {
                navigate("read-json-from-file");
              },
              link: "read-json-from-file",
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
