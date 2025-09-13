import JSZip from "jszip";

export async function GetXMLsFromDocx(fileArrayBuffer) {
  const zip = await JSZip.loadAsync(fileArrayBuffer);

  const documentXml = await zip.file("word/document.xml")!.async("string");
  const stylesXml = await zip.file("word/styles.xml")!.async("string");
  const themesXml = await zip.file("word/theme/theme1.xml")!.async("string");

  return {
    doc: documentXml,
    style: stylesXml,
    theme: themesXml,
  };
}
