import { BaseSyntheticEvent, useState } from "react";
import JSZip from "jszip";
import { ParseXMLs } from "../tools/Docx2PDF/XMLs Handling/parseXMLs";
import { FilePath } from "../tools/Docx2PDF/filePathMap";
import FileUpload from "../components/ui/FileUpload";

export default function DocxXmlParser() {
  const handleFileChange = async (event: BaseSyntheticEvent) => {
    const file = event.target.files[0];
    if (!file) return;

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

      const parsedJSON = ParseXMLs(
        stylesXml,
        themesXml,
        documentXml,
        numbersXml,
        zip
      );
      // generatePdfFromJson(parsedJSON);
    } catch (err) {
      console.error("Error reading DOCX:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <FileUpload onFileChange={handleFileChange} onUrlChange={() => {}} />
    </div>
  );
}
