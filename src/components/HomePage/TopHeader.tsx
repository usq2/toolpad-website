import { memo } from "react";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import Logo from "../../assets/tools-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";
export const TopHeader = memo(() => {
  const navigate = useNavigate();
  return (
    <div className="flex px-4 py-2 flex-12 bg-red-300 justify-between">
      <img
        className="size-10 shrink-1"
        src={Logo}
        onClick={() => {
          navigate("/");
        }}
      />
      <div className="flex justify-end items-center">
        <ThemeSwitcher />
        <img className="size-10 shrink-1 px-1" src={Logo} />
        <img className="size-10 shrink-1 px-1" src={Logo} />
      </div>
    </div>
  );
});
