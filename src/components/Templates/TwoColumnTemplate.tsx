import { FC, ReactNode } from "react";
import { ToolHeader } from "../ui/Toolheader";
export const TwoColumnTemplate: FC<{
  Column1: ReactNode;
  Column2: ReactNode;
  ButtonComponent: ReactNode;
  header: string;
  subHeader: string;
}> = ({ Column1, Column2, ButtonComponent, header, subHeader }) => {
  return (
    <div className="flex flex-col items-center flex-1">
      <ToolHeader header={header} subHeader={subHeader} />

      <div className="flex flex-col w-full justify-center items-center grow-4 my-2">
        <div className="flex flex-col shadow-xl dark:inset-shadow-gray-900 w-3/4 h-9/10 dark:bg-gray-900  bg-orange-hover-bg rounded-4xl justify-center">
          <div className="flex flex-col-reverse md:flex-row max-w-full justify-center items-center mx-3 mt-2 h-4/5 gap-5 px-5 pt-5">
            {Column1}
            {Column2}
          </div>
          <div className="flex w-full mt-4 justify-center-safe items-baseline">
            {ButtonComponent}
          </div>
        </div>
      </div>
    </div>
  );
};
