import React, { useState } from "react";
import jsPDF from "jspdf";

export default function ImagesToPdf() {
  const [files, setFiles] = useState([]);

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    files.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const imgData = ev.target!.result;
        if (idx > 0) doc.addPage();
        doc.addImage(imgData as string, "JPEG", 10, 10, 180, 260);
        if (idx === files.length - 1) doc.save("images.pdf");
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <h2>Images to PDF</h2>
      <input type="file" accept="image/*" multiple onChange={handleFiles} />
      <button onClick={downloadPdf} disabled={!files.length}>
        Download PDF
      </button>
    </div>
  );
}
