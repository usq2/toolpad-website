import { ReactElement, FC } from "react";
import DevToolsLogo from "/dev.svg";
import DocxToPdf from "/docx-to-pdf.svg";
import DataConvertLogo from "/data-convert.svg";
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
      className="flex flex-col cursor-pointer bg-gray-50 hover:bg-white-soft  dark:bg-gray-700
      p-3 rounded-2xl justify-evenly m-4 shadow-gray-200 shadow-xl ps-5 dark:shadow-gray-900"
      onClick={handleClick}
      style={{ height: "300px", width: "350px" }}
    >
      <img className="size-24 shrink-1" src={src} />
      <div className="flex flex-col gap-2">
        <span className="text-gray-800 dark:text-gray-200 text-xl font-semibold font-roboto">
          {text}
        </span>
        <span className="text-gray-500 text-xs dark:text-gray-400 tracking-wider">
          {subtext}
        </span>
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
    {
      id: "docx-to-pdf",
      src: DocxToPdf,
      onClick: () => navigate("/docx-to-pdf"),
      text: "Convert simple docx to pdf",
      subtext: "Convert Simple Word Docs to pdf",
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
    <div className="flex justify-around dark:bg-gray-800 w-full h-full">
      <div className="flex flex-row flex-wrap justify-center items-center gap-4 my-4 mx-4 w-full">
        {grid}
      </div>
    </div>
  );
};
