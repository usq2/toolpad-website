import { ReactElement } from "react";
import Logo from "../../assets/tools-svgrepo-com.svg";
import DevToolsLogo from "../../assets/dev.svg";
import { useNavigate } from "react-router-dom";

const ToolsLogo = ({ src, text, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <div
      className="flex flex-col justify-center items-center cursor-pointer"
      onClick={handleClick}
    >
      <img className="size-16 shrink-1" src={src} />
      <span className="dark:text-white text-xs text-center">{text}</span>
    </div>
  );
};
export const ToolsGrid = ({ data }) => {
  const numRows = data / 6;
  const style = `grid md:grid-rows-${numRows} grid-rows-${
    numRows * 2
  } md:grid-cols-6 grid-cols-3 gap-3 items-center justify-center my-4 mx-4 w-2/3`;
  const grid: ReactElement[] = [];
  const navigate = useNavigate();
  grid.push(
    <ToolsLogo
      src={DevToolsLogo}
      onClick={() => {
        navigate("/encode-decode/string-to-base64");
      }}
      text={"String Manipulation Tools"}
    />
  );
  for (let i = 1; i < data; i++) {
    grid.push(<ToolsLogo src={Logo} onClick={null} text={"dev in progress"} />);
  }
  return (
    <div className="flex justify-center">
      <div className={style}>{grid}</div>
    </div>
  );
};
