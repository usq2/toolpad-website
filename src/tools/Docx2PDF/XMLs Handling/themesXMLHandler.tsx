import { ThemeFonts } from "../types/types";

export class Themes {
  constructor(pThemesXML: string) {
    this._vParser = new DOMParser();
    this._vThemesDOM = this._vParser.parseFromString(
      pThemesXML,
      "application/xml"
    );
    this._vThemeFonts = this.parseThemeFonts();
  }

  getFonts = (Fonts: Element) => {
    return {
      HAnsi: this.MapToDefaultFonts(
        Fonts.getElementsByTagNameNS(this.NAMESPACE, "latin")[0].getAttribute(
          "typeface"
        ) || ""
      ),
      EastAsia: this.MapToDefaultFonts(
        Fonts.getElementsByTagNameNS(this.NAMESPACE, "ea")[0].getAttribute(
          "typeface"
        ) || ""
      ),
      Bidi: this.MapToDefaultFonts(
        Fonts.getElementsByTagNameNS(this.NAMESPACE, "cs")[0].getAttribute(
          "typeface"
        ) || ""
      ),
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
      majorHAnsi: majors.HAnsi,
      majorEastAsia: majors.EastAsia,
      majorBidi: majors.Bidi,
      minorHAnsi: minors.HAnsi,
      minorEastAsia: minors.EastAsia,
      minorBidi: minors.Bidi,
    };
  };

  getThemeFonts() {
    return this._vThemeFonts;
  }

  private _vParser: DOMParser;
  private _vThemesDOM: Document;
  private _vThemeFonts: ThemeFonts;

  NAMESPACE = "http://schemas.openxmlformats.org/drawingml/2006/main";
}
