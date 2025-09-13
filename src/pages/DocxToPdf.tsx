// import React, { useState } from "react";
// import mammoth from "mammoth";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// export default function DocxToPdf() {
//   const [htmlContent, setHtmlContent] = useState("");
//   const handleFile = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const arrayBuffer = await file.arrayBuffer();
//     const { value } = await mammoth.convertToHtml({ arrayBuffer });
//     setHtmlContent(value);
//   };

//   const downloadPdf = async () => {
//     const doc = new jsPDF("p", "pt", "a4");
//     const element = document.getElementById("docx-preview");
//     const canvas = await html2canvas(element!, { scale: 2 });
//     const imgData = canvas.toDataURL("image/png");
//     const imgProps = doc.getImageProperties(imgData);
//     const pdfWidth = doc.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
//     doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     doc.save("converted.pdf");
//   };

//   return (
//     <div>
//       <h2>DOCX to PDF</h2>
//       <input type="file" accept=".docx" onChange={handleFile} />
//       {htmlContent && (
//         <>
//           <div
//             id="docx-preview"
//             dangerouslySetInnerHTML={{ __html: htmlContent }}
//             style={{ background: "white", padding: "10px" }}
//           ></div>
//           <button onClick={downloadPdf}>Download PDF</button>
//         </>
//       )}
//     </div>
//   );
// }
import React, { useState } from "react";
import JSZip from "jszip";
import { ParseXMLs } from "../tools/Docx2PDF/XMLs Handling/parseXMLs";
import { generatePdfFromJson } from "../tools/Docx2PDF/generatePDF";

export default function DocxXmlParser() {
  const [xmlContent, setXmlContent] = useState("");
  const [styleContent, setStyleContent] = useState("");
  const [themeContent, setThemeContent] = useState("");
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    setError(null);
    setXmlContent("");
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer();

      // Load zip
      const zip = await JSZip.loadAsync(arrayBuffer);

      // Extract word/document.xml file as text
      const documentXml = await zip.file("word/document.xml")!.async("string");
      const stylesXml = await zip.file("word/styles.xml")!.async("string");
      const themesXml = await zip
        .file("word/theme/theme1.xml")!
        .async("string");
      setXmlContent(documentXml);
      setStyleContent(stylesXml);
      setThemeContent(themesXml);

      // // Optionally parse the XML for manipulation
      // const parser = new DOMParser();
      // const xmlDoc = parser.parseFromString(documentXml, "application/xml");

      // // Example: Find all text nodes (<w:t>) in the document
      // const texts = xmlDoc.getElementsByTagName("w:t");
      // console.log("All text nodes in DOCX:", texts);

      // // Further queries on styles, runs (<w:r>), paragraphs (<w:p>), etc. can be done here
      // // For example, log the first few texts
      // for (let i = 0; i < texts.length; i++) {
      //   console.log(texts[i].textContent);
      // }
      const parsedJSON = ParseXMLs(stylesXml, themesXml, documentXml);
      // generatePdfFromJson(parsedJSON);
    } catch (err) {
      console.error("Error reading DOCX:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Parse DOCX XML (WordprocessingML)</h2>
      <input type="file" accept=".docx" onChange={handleFileChange} />
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* <h3>Raw word/document.xml content:</h3>
      <textarea
        style={{ width: "100%", height: "300px", whiteSpace: "pre-wrap" }}
        value={xmlContent}
        readOnly
      />
      <h3>Raw word/styles.xml content:</h3>
      <textarea
        style={{ width: "100%", height: "300px", whiteSpace: "pre-wrap" }}
        value={styleContent}
        readOnly
      />
      <h3>Raw word/theme.xml content:</h3>
      <textarea
        style={{ width: "100%", height: "300px", whiteSpace: "pre-wrap" }}
        value={themeContent}
        readOnly
      /> */}
    </div>
  );
}
