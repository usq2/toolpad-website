import { FC } from "react";
import { BreadCrumbs } from "./BreadCrumbs";
export const ToolHeader: FC<{ header: string; subHeader: string }> = ({
  header,
  subHeader,
}) => {
  return (
    <div className="flex flex-col justify-center w-3/4 grow-1 gap-3 ps-5">
      <BreadCrumbs />
      <span className="text-4xl dark:text-gray-100 font-bold text-orange-100 ">
        {header}
      </span>
      <span className="text-xl dark:text-gray-400 text-orange-muted">
        {subHeader}
      </span>
    </div>
  );
};
