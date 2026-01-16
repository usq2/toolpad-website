import { Styles } from "./stylesXMLHandler";
import { Themes } from "./themesXMLHandler";
import { Numbers } from "./numberXMLHandler";
import { DocumentParser } from "./documentXMLHandler";
import { JSONBuilder } from "./JSONBuilder";
import { generatePDF } from "./generatePDF";
import JSZip from "jszip";

/**
 *
 * @param stylesXmlStr  Styles XML
 * @param themeXmlStr  Themes XML
 * @param documentXmlStr  Document XML
 *
 * What am i trying to do here?
 * 1. Read all texts and paragraphs with style id from the document xml, populate in JSON
 * 2. Extract default paragraph styles applicable to all paragraphs that dont have a specific style
 * with it
 * 3. Read default fonts and keep them in the styles
 */
export async function ParseXMLs(
  stylesXmlStr: string,
  themeXmlStr: string,
  documentXmlStr: string,
  numbersXml: string | undefined,
  zip: JSZip
) {
  const themes = new Themes(themeXmlStr);
  const styles = new Styles(stylesXmlStr, themes.getThemeData().fonts);
  const numbers = numbersXml ? new Numbers(numbersXml) : null;
  const text = new DocumentParser(
    documentXmlStr,
    styles,
    zip,
    numbers?.numMap()
  );
  const json = new JSONBuilder(text, themes);
  const { finalJSON, pageConfig } = await json.prepareJSON();
  await generatePDF(finalJSON, pageConfig);
}
