import { HeaderBanner } from "../components/HomePage/HeaderBanner";
import { ToolsGrid } from "../components/HomePage/ToolsGrid";
import { TopHeader } from "../components/HomePage/TopHeader";

export const HomePage = () => {
  return (
    <>
      <TopHeader />
      <HeaderBanner />
      <ToolsGrid data={30} />
    </>
  );
};
