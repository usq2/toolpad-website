import { BaseSyntheticEvent, useState } from "react";
import JSZip from "jszip";
import { ParseXMLs } from "../../../tools/Docx2PDF/XMLs Handling/parseXMLs";
import { FilePath } from "../../../tools/Docx2PDF/filePathMap";
import { OpenFile } from "../../../components/ui/OpenFile";
import { ToolHeader } from "../../../components/ui/Toolheader";

export default function DocxXmlParser() {
  const [progress, setProgress] = useState(false);
  const handleFileChange = async (event: BaseSyntheticEvent) => {
    const file = event.target.files[0];
    if (!file) return;
    setProgress(true);
    try {
      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();

      // Load zip
      const zip = await JSZip.loadAsync(arrayBuffer);

      // what if this is in GBs??
      const documentXml = await zip.file(FilePath.DOCUMENT)!.async("string");
      const stylesXml = await zip.file(FilePath.STYLE)!.async("string");
      const themesXml = await zip.file(FilePath.THEME)!.async("string");
      const numbersXml = await zip.file(FilePath.NUMBERING)?.async("string");

      ParseXMLs(stylesXml, themesXml, documentXml, numbersXml, zip);
    } catch (err) {
      console.error("Error reading DOCX:", err);
    }
    setProgress(false);
  };

  return (
    <div className="flex flex-col items-center flex-1 w-full">
      <ToolHeader
        header={"Word Docx to PDF"}
        subHeader={"Converts simple word documents to pdf"}
      />
      <div className="flex flex-col w-full justify-center items-center grow-4 my-2">
        <div className="flex flex-col shadow-xl dark:inset-shadow-gray-900 w-3/4 h-9/10 dark:bg-gray-900  bg-orange-hover-bg rounded-4xl justify-center">
          <div className="flex flex-col-reverse md:flex-row max-w-full justify-center items-center mx-3 mt-2 h-4/5 gap-5 px-5 pt-5">
            {!progress ? (
              <OpenFile onFileChange={handleFileChange} />
            ) : (
              <span>Converting your file....</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
