import { ThemeColors, ThemeFonts } from "../types/types";

export class Themes {
  constructor(pThemesXML: string) {
    this._vParser = new DOMParser();
    this._vThemesDOM = this._vParser.parseFromString(
      pThemesXML,
      "application/xml"
    );
    this._vThemeFonts = this.parseThemeFonts();
    this._vThemeColors = this.parseThemeColors();
  }

  getFonts = (Fonts: Element) => {
    return {
      HAnsi: this.MapToDefaultFonts(
        Fonts.getElementsByTagNameNS(this.NAMESPACE, "latin")[0].getAttribute(
          "typeface"
        ) || ""
      ),
      // add these in future
      // EastAsia: this.MapToDefaultFonts(
      //   Fonts.getElementsByTagNameNS(this.NAMESPACE, "ea")[0].getAttribute(
      //     "typeface"
      //   ) || ""
      // ),
      // Bidi: this.MapToDefaultFonts(
      //   Fonts.getElementsByTagNameNS(this.NAMESPACE, "cs")[0].getAttribute(
      //     "typeface"
      //   ) || ""
      // ),
    };
  };
  private MapToDefaultFonts = (Font: string) => {
    switch (Font) {
      case "Calibri":
      case "Cambria":
        return "Helvetica";
      default:
        return Font;
    }
  };
  parseThemeFonts = (): ThemeFonts => {
    const majorFont = Array.from(
      this._vThemesDOM.getElementsByTagNameNS(this.NAMESPACE, "majorFont")
    );
    const minorFont = Array.from(
      this._vThemesDOM.getElementsByTagNameNS(this.NAMESPACE, "minorFont")
    );

    const minors = this.getFonts(minorFont[0]);
    const majors = this.getFonts(majorFont[0]);
    return {
      majorFont: majors.HAnsi,
      // majorEastAsia: majors.EastAsia,
      // majorBidi: majors.Bidi,
      minorFont: minors.HAnsi,
      // minorEastAsia: minors.EastAsia,
      // minorBidi: minors.Bidi,
    };
  };
  parseThemeColors = () => {
    const themeColors = Array.from(
      this._vThemesDOM.getElementsByTagNameNS(this.NAMESPACE, "clrScheme")
    );
    let colors: ThemeColors = {};
    themeColors[0].childNodes.forEach((node) => {
      let { nodeName } = node;
      nodeName = nodeName.toLowerCase();

      let val = null;
      if (
        node?.firstChild &&
        Object.hasOwn(node?.firstChild, "getAttribute") &&
        typeof node?.firstChild?.getAttribute === "function"
      ) {
        val = node.firstChild?.getAttribute("val");
      } else if (node.childNodes.length > 1) {
        val = node.childNodes?.[1]?.getAttribute("val");
      }
      if (val) {
        if (nodeName.includes("accent")) {
          colors[nodeName.slice(2)] = val;
        } else if (nodeName.includes("hlink")) {
          colors["hyperlink"] = val;
        }
      }
    });
    return colors;
  };
  getThemeData() {
    return {
      fonts: {
        ...this._vThemeFonts,
      },
      colors: {
        ...this._vThemeColors,
      },
    };
  }

  private _vParser: DOMParser;
  private _vThemesDOM: Document;
  private _vThemeFonts: ThemeFonts;
  private _vThemeColors: ThemeColors;

  NAMESPACE = "http://schemas.openxmlformats.org/drawingml/2006/main";
}
