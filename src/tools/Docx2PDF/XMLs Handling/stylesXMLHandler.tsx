import { BasicStyle, ThemeFonts } from "../types/types";

export class Styles {
  constructor(pStylesXML: string, pThemeFonts: ThemeFonts) {
    this._vParser = new DOMParser();
    this._vStylesDOM = this._vParser.parseFromString(
      pStylesXML,
      "application/xml"
    );
    this.defaultStyles = this.getDefaultStyles(pThemeFonts);
  }

  private getDefaultStyles(themeFonts) {
    const styleElements = Array.from(
      this._vStylesDOM.getElementsByTagNameNS(this.NAMESPACE, "style")
    );
    const defaultStyleNode = Array.from(
      this._vStylesDOM.getElementsByTagNameNS(this.NAMESPACE, "docDefaults")
    );
    let runDefaults = Array.from(
      defaultStyleNode[0].getElementsByTagNameNS(this.NAMESPACE, "rPrDefault")
    );
    let defaultStyle: BasicStyle | null = null;
    runDefaults.forEach((element) => {
      let rPrs = Array.from(
        element.getElementsByTagNameNS(this.NAMESPACE, "rPr")
      );
      if (rPrs.length) {
        defaultStyle = this.parseCommonStyles(rPrs[0], themeFonts);
        return defaultStyle;
      }
    });
    return defaultStyle;
  }
  getStyleById(styleElements: Element[], styleId: String) {
    return (
      styleElements.find((el) => el.getAttribute("w:styleId") === styleId) ||
      null
    );
  }

  getStyles() {
    return this.defaultStyles;
  }
  private parseCommonStyles(StyleNode: Element, ThemeFonts: ThemeFonts) {
    let styles: BasicStyle = {
      fontFamily: "",
      fontSize: 0,
      bold: false,
      italics: false,
      color: "#000",
      underline: "none",
      strike: false,
    };
    let size = Array.from(
      StyleNode.getElementsByTagNameNS(this.NAMESPACE, "sz")
    )[0];
    if (size) {
      styles.fontSize =
        parseInt(size.getAttributeNS(this.NAMESPACE, "val")!) / 2;
    }
    let bold = Array.from(
      StyleNode.getElementsByTagNameNS(this.NAMESPACE, "b")
    )[0];
    if (bold) {
      styles.bold = true;
    }
    let italics = Array.from(
      StyleNode.getElementsByTagNameNS(this.NAMESPACE, "i")
    )[0];
    if (italics) {
      styles.italics = true;
    }
    let underline = Array.from(
      StyleNode.getElementsByTagNameNS(this.NAMESPACE, "u")
    )[0];
    if (underline) {
      styles.underline = underline.getAttributeNS(this.NAMESPACE, "val")!;
    }
    let color = Array.from(
      StyleNode.getElementsByTagNameNS(this.NAMESPACE, "color")
    )[0];
    if (color) {
      styles.underline = underline.getAttributeNS(this.NAMESPACE, "color")!;
    }
    let strike = Array.from(
      StyleNode.getElementsByTagNameNS(this.NAMESPACE, "strike")
    )[0];
    if (strike) {
      styles.underline = underline.getAttributeNS(this.NAMESPACE, "strike")!;
    }
    let fonts = Array.from(
      StyleNode.getElementsByTagNameNS(this.NAMESPACE, "rFonts")
    )[0];
    if (fonts) {
      styles.fontFamily =
        ThemeFonts[fonts.getAttributeNS(this.NAMESPACE, "asciiTheme")!];
    }
    return styles;
  }

  defaultStyles: BasicStyle | null;
  private _vParser: DOMParser;
  private _vStylesDOM: Document;

  NAMESPACE = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
}
