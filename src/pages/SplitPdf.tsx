import { PDFDocument } from "pdf-lib";

export default function SplitPdf() {
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(page);
      const bytes = await newPdf.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `page-${i + 1}.pdf`;
      link.click();
    }
  };

  return (
    <div>
      <h2>Split PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFile} />
    </div>
  );
}
