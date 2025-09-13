import jsPDF from "jspdf";
function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length !== 6) return null;
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}
export const generatePdfFromJson = (pdfJson) => {
  const doc = new jsPDF();
  let cursorY = 20; // Starting Y position

  pdfJson.forEach((paragraph) => {
    paragraph.textRuns.forEach((run) => {
      // Apply styles from JSON for each run
      doc.setFont(
        run.style.fontFamily.toLowerCase() || "helvetica",
        run.style.bold ? "bold" : "normal"
      );
      doc.setFontSize(run.style.fontSize || 11);
      const rgb = hexToRgb(run.style.color || "#000000");
      if (rgb) {
        doc.setTextColor(rgb.r, rgb.g, rgb.b);
      }

      // Simple handling of italic and underline
      if (run.style.italic) {
        doc.setFont(
          run.style.fontFamily || "helvetica",
          run.style.bold ? "bolditalic" : "italic"
        );
      }
      if (run.style.underline) {
        // jsPDF underline requires separate handling or plugins, omitted here for simplicity
      }

      // Draw text at current y-position (X left margin fixed)
      const x = 20;
      doc.text(run.text, x, cursorY);

      // Move cursor down for next run or paragraph (simple line height)
      cursorY += (run.style.fontSize || 11) * 1.2;
    });

    // Add paragraph spacing after the end of a paragraph
    cursorY += paragraph.paragraphStyle.spacingAfter || 10;
  });

  //   doc.save("converted.pdf");
};
