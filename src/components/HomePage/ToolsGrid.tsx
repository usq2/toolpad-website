import { ReactElement, FC } from "react";
import Logo from "../../assets/tools-svgrepo-com.svg";
import DevToolsLogo from "../../assets/dev.svg";
import DataConvertLogo from "../../assets/data-convert.svg";
import { useNavigate } from "react-router-dom";

const ToolsLogo: FC<{
  text: string;
  onClick: Function | null;
  src: string;
  subtext?: string;
}> = ({ src, text, onClick, subtext }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <div
      className="flex flex-col cursor-pointer bg-gray-50 hover:bg-white-bg 
      p-3 border-1 border-orange-muted hover:border-orange-hover rounded-xl justify-evenly m-4"
      onClick={handleClick}
      style={{ height: "200px", width: "300px" }}
    >
      <img className="size-16 shrink-1" src={src} />
      <div className="flex flex-col gap-2">
        <span className="text-gray-800 text-lg font-semibold font-roboto">
          {text}
        </span>
        <span className="text-gray-500 text-sm">{subtext}</span>
      </div>
    </div>
  );
};

export const ToolsGrid = () => {
  const data = [
    {
      id: "encoder",
      src: DataConvertLogo,
      onClick: () => navigate("tool-encode-decode/string-to-base64"),
      text: "Data conversion utility suite",
      subtext: "Convert string to hex, base64 and vice versa",
    },
    {
      id: "formatter",
      src: DevToolsLogo,
      onClick: () => navigate("/tool-xml-json-formatter/read-xml-from-text"),
      text: "XML/JSON Formatting",
      subtext: "Prettify XML, JSON from file or from text",
    },
  ];

  const grid: ReactElement[] = [];
  const navigate = useNavigate();
  data.forEach((elem) => {
    grid.push(
      <ToolsLogo
        src={elem.src}
        onClick={elem.onClick}
        text={elem.text}
        subtext={elem.subtext}
        key={elem.id}
      />
    );
  });

  return (
    <div className="flex justify-around dark:bg-gray-700 w-full">
      <div className="flex flex-row flex-wrap justify-center items-center gap-4 my-4 mx-4 w-full">
        {grid}
      </div>
    </div>
  );
};
