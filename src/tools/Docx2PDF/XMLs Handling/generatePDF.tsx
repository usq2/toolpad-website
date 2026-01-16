import { JSONStruct, PDFConfig } from "../types/types";
import { PDFBuilder } from "./PDFBuilder";

// Usage
export async function generatePDF(pJSONData: unknown, pConfigData: unknown) {
  const builder = new PDFBuilder(pConfigData as PDFConfig);

  await builder.init();
  await builder.addElements(pJSONData as JSONStruct);
  const pdfBytes = await builder.build();

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  try {
    const url = URL.createObjectURL(blob);
    window.open(url);

    console.log("PDF generated successfully");
  } catch (error) {
    console.log(error);
  }
}
