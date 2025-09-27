import { FC, ReactNode } from "react";
export const TwoColumnTemplate: FC<{
  Column1: ReactNode;
  Column2: ReactNode;
  ButtonComponent: ReactNode;
}> = ({ Column1, Column2, ButtonComponent }) => {
  return (
    <div className="flex flex-col flex-grow items-center">
      <div
        className="flex justify-center items-center"
        style={{ height: "15vh" }}
      >
        <span> Ad Goes Here</span>
      </div>
      <div className="flex  w-full justify-center items-center flex-grow my-2">
        <div className="flex flex-col-reverse md:flex-row w-full justify-center items-center mx-3 my-2 h-full">
          {Column1}
          {Column2}
        </div>
      </div>
      {ButtonComponent}
    </div>
  );
};
