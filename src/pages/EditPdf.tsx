import React, { useState } from "react";
import { PDFDocument, rgb, degrees } from "pdf-lib";

export default function EditPdf() {
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [fileName, setFileName] = useState("");

  const loadPdf = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const arrayBuffer = await file.arrayBuffer();
    const doc = await PDFDocument.load(arrayBuffer);
    setPdfDoc(doc);
  };

  const addText = () => {
    if (!pdfDoc) {
      return;
    }
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    firstPage.drawText("Hello from pdf-lib", {
      x: 50,
      y: 700,
      size: 20,
      color: rgb(0, 0, 0),
    });
  };

  const addRectangle = () => {
    if (!pdfDoc) {
      return;
    }
    const firstPage = pdfDoc.getPages()[0];
    firstPage.drawRectangle({
      x: 100,
      y: 600,
      width: 100,
      height: 50,
      color: rgb(0.95, 0.1, 0.1),
    });
  };

  const rotatePage = () => {
    if (!pdfDoc) {
      return;
    }
    const firstPage = pdfDoc.getPages()[0];
    firstPage.setRotation(degrees(90));
  };

  const savePdf = async () => {
    if (!pdfDoc) {
      return;
    }
    const bytes = await pdfDoc.save();
    const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName.replace(".pdf", "-edited.pdf");
    link.click();
  };

  return (
    <div>
      <h2>Edit PDF</h2>
      <input type="file" accept="application/pdf" onChange={loadPdf} />
      {pdfDoc && (
        <>
          <button onClick={addText}>Add Text</button>
          <button onClick={addRectangle}>Add Rectangle</button>
          <button onClick={rotatePage}>Rotate Page</button>
          <button onClick={savePdf}>Save PDF</button>
        </>
      )}
    </div>
  );
}
