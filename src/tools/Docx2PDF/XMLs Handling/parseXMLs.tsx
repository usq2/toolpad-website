import { Styles } from "./stylesXMLHandler";
import { Themes } from "./themesXMLHandler";

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
export function ParseXMLs(
  stylesXmlStr: string,
  themeXmlStr: string,
  documentXmlStr: string
) {
  const themes = new Themes(themeXmlStr);
  const styles = new Styles(stylesXmlStr, themes.getThemeFonts());
  console.log(styles.getStyles());
  // const pdfJson = parseDocumentXml(documentXmlStr, stylesDom, themeFonts);
  // return pdfJson;
  // const docStyles: Array<BasicStyle> = [];
  // console.log(defaultStyles);
}

// export function twipToPt(value) {
//   return value ? parseInt(value) / 20 : null;
// }

// export function halfPointToPt(value) {
//   return value ? parseInt(value) / 2 : null;
// }
// export function extractStyleProperties(styleEl) {
//   if (!styleEl) return {};

//   const pPr = styleEl.querySelector("w\\:pPr");
//   const rPr = styleEl.querySelector("w\\:rPr");

//   const style: any = {};

//   if (pPr) {
//     style.paragraph = {};
//     style.paragraph.keepNext = pPr.querySelector("w\\:keepNext") !== null;
//     style.paragraph.keepLines = pPr.querySelector("w\\:keepLines") !== null;

//     const spacing = pPr.querySelector("w\\:spacing");
//     if (spacing) {
//       style.paragraph.spacingBefore =
//         twipToPt(spacing.getAttribute("w:before")) || 0;
//       style.paragraph.spacingAfter =
//         twipToPt(spacing.getAttribute("w:after")) || 0;
//     }

//     const jc = pPr.querySelector("w\\:jc");
//     if (jc) {
//       style.paragraph.alignment = jc.getAttribute("w:val");
//     }

//     const outlineLvl = pPr.querySelector("w\\:outlineLvl");
//     if (outlineLvl) {
//       style.paragraph.outlineLevel = parseInt(outlineLvl.getAttribute("w:val"));
//     }
//   }

//   if (rPr) {
//     style.character = {};
//     const rFonts = rPr.querySelector("w\\:rFonts");
//     if (rFonts) {
//       style.character.fontFamilyThemeAscii =
//         rFonts.getAttribute("w:asciiTheme");
//     }

//     style.character.bold = rPr.querySelector("w\\:b") !== null;
//     style.character.italic = rPr.querySelector("w\\:i") !== null;

//     const colorEl = rPr.querySelector("w\\:color");
//     if (colorEl) {
//       style.character.color = "#" + colorEl.getAttribute("w:val");
//     }

//     const sz = rPr.querySelector("w\\:sz");
//     if (sz) {
//       style.character.fontSize = halfPointToPt(sz.getAttribute("w:val"));
//     }
//   }

//   return style;
// }

// export const parseDocumentXml = (
//   documentXmlStr,
//   stylesXMLString,
//   themeFonts
// ) => {
//   const parser = new DOMParser();
//   const docDom = parser.parseFromString(documentXmlStr, "application/xml");
//   const stylesDom = parser.parseFromString(stylesXMLString, "application/xml");

//   const styleElements = Array.from(
//     stylesDom.getElementsByTagNameNS(wNS, "style")
//   );
//   const paragraphs = Array.from(docDom.getElementsByTagName("w:p"));

//   const result: any = [];

//   paragraphs.forEach((p) => {
//     // Paragraph style id
//     const pStyleEl = Array.from(p.getElementsByTagName("w:pStyle"));
//     const styleId = pStyleEl[0]?.getAttribute("w:val") || "Normal";

//     // Get style element
//     const styleEl = getStyleById(styleElements, styleId);
//     const styleProps = extractStyleProperties(styleEl);

//     // Resolve font family from theme using theme reference if present
//     if (styleProps.character?.fontFamilyThemeAscii) {
//       const themeKey = styleProps.character.fontFamilyThemeAscii;
//       styleProps.character.fontFamily = themeFonts[themeKey] || "Helvetica";
//     } else {
//       styleProps.character = styleProps.character || {};
//       styleProps.character.fontFamily = "Helvetica";
//     }

//     // Extract text runs in paragraph, merging direct formatting if you want (simplified here)
//     let textRuns: any = [];
//     Array.from(p.getElementsByTagName("w:r")).forEach((r) => {
//       const t = Array.from(r.getElementsByTagName("w:t"));
//       t.forEach((text) => {
//         if (text) {
//           // Simplified: ignoring run-level direct formatting for now
//           textRuns.push({
//             text: text.textContent,
//             style: {
//               fontFamily: styleProps.character.fontFamily,
//               fontSize: styleProps.character.fontSize || 11,
//               bold: styleProps.character.bold || false,
//               italic: styleProps.character.italic || false,
//               color: styleProps.character.color || "#000000",
//             },
//           });
//         }
//       });
//     });

//     result.push({
//       textRuns,
//       paragraphStyle: {
//         alignment: styleProps.paragraph?.alignment || "left",
//         spacingBefore: styleProps.paragraph?.spacingBefore || 0,
//         spacingAfter: styleProps.paragraph?.spacingAfter || 0,
//         keepNext: styleProps.paragraph?.keepNext || false,
//         keepLines: styleProps.paragraph?.keepLines || false,
//         outlineLevel: styleProps.paragraph?.outlineLevel || null,
//         styleId,
//       },
//     });
//   });

//   return result;
// };
