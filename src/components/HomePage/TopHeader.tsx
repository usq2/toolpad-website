import { memo } from "react";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import Logo from "/tools-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";
export const TopHeader = memo(() => {
  const navigate = useNavigate();
  return (
    <div className="flex px-4 py-2 flex-1 dark:bg-gray-700 bg-primary justify-between bg-white-soft drop-shadow-md dark:shadow-white-soft dark:drop-shadow-xl max-h-16">
      <div className="flex flex-row justify-center gap-3">
        <img
          className="size-10 shrink-1"
          src={Logo}
          onClick={() => {
            navigate("/");
          }}
        />
        <span className="dark:text-white-soft text-gray-800 self-center text-xl font-bold tracking-wide">
          Toolpad
        </span>
      </div>
      <div className="flex justify-end items-center">
        <ThemeSwitcher />
      </div>
    </div>
  );
});
