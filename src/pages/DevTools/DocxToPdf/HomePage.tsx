import { TopHeader } from "../../../components/HomePage/TopHeader";
import { Outlet } from "react-router-dom";

export const DocxToPDFHomePage = () => {
  //links are based on routes object
  return (
    <div className="flex flex-col min-h-screen">
      <TopHeader />
      <div className="flex flex-grow">
        <Outlet />
      </div>
    </div>
  );
};
