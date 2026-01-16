/**
 * Main JSON builder class for buiilding PDF
 *
 * JSON structure
 * {
 *  sections: [
 *    page: {pageData, size & margin},
 *    content:[]
 *  ]
 * }
 */

import { DocumentParser } from "./documentXMLHandler";
import { Themes } from "./themesXMLHandler";

export class JSONBuilder {
  constructor(pDocument: DocumentParser, pThemes: Themes) {
    this._vDocXML = pDocument;
    this._vThemes = pThemes;
  }

  async prepareJSON() {
    let pageConfig = this._vDocXML.sectionDimensions();
    let content = await this._vDocXML.getContent();
    let finalJSON = {
      document: {
        meta: {
          title: "Converted Document",
          author: "toolpad.in",
          creationDate: new Date(),
        },
        theme: {
          ...this._vThemes.getThemeData(),
        },
        sections: [...content],
      },
    };
    return { finalJSON, pageConfig };
  }
  private _vDocXML: DocumentParser;
  private _vThemes: Themes;
}
