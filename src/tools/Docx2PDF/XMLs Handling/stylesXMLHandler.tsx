import {
  BasicStyle,
  StylesMap,
  TableBordersObj,
  TableStyle,
  ThemeFonts,
} from "../types/types";

// Need to further improve it by mapping all styles while class creation
export class Styles {
  constructor(pStylesXML: string, pThemeFonts: ThemeFonts) {
    this._vParser = new DOMParser();
    this._vStylesDOM = this._vParser.parseFromString(
      pStylesXML,
      "application/xml",
    );
    this.themeFonts = pThemeFonts;
    this.defaultStyles = this.getDefaultStyles();
    this._vStylesMap = this.getAllStyles();
  }

  private getDefaultStyles() {
    const defaultStyleNode = Array.from(
      this._vStylesDOM.getElementsByTagNameNS(this.NAMESPACE, "docDefaults"),
    );
    let runDefaults = Array.from(
      defaultStyleNode[0].getElementsByTagNameNS(this.NAMESPACE, "rPrDefault"),
    );
    let defaultStyle: BasicStyle | null = this.parseCommonStyles(
      runDefaults[0],
      "default",
      this.themeFonts,
    );
    return defaultStyle;
  }
  private getAllStyles() {
    const stylesMap: StylesMap = {};
    const styles = this._vStylesDOM.getElementsByTagNameNS(
      this.NAMESPACE,
      "style",
    ); // All <w:style>

    for (let i = 0; i < styles.length; i++) {
      const styleNode = styles[i] as Element;
      const styleIdAttr = styleNode.getAttributeNS(this.NAMESPACE, "styleId");
      if (!styleIdAttr) continue;
      const type = styleNode.getAttributeNS(this.NAMESPACE, "type");
      if (type === "table") {
        stylesMap[styleIdAttr] = this.parseTableStyles(styleNode, stylesMap);
      } else {
        stylesMap[styleIdAttr] = this.parseCommonStyles(
          styleNode,
          styleIdAttr,
          this.themeFonts,
        );
      }
    }
    return stylesMap;
  }

  getStyleById(pStyleId: string) {
    if (!this._vStylesMap[pStyleId]) return null;
    return this._vStylesMap[pStyleId];
  }
  getStyles() {
    return this.defaultStyles;
  }

  private twipsToPt = (twips?: string | null): number => {
    if (!twips) return 0;
    return parseInt(twips, 10) / 20;
  };

  private commonBorderHelper(pElement: Element) {
    let retval = {
      color: "",
      thickness: 0,
      space: 0,
    };
    const val =
      pElement.getAttributeNS(this.NAMESPACE, "val") ||
      pElement.getAttribute("w:val");
    if (val && val !== "nil") {
      const sz =
        pElement.getAttributeNS(this.NAMESPACE, "sz") ||
        pElement.getAttribute("w:sz") ||
        "0";
      const space =
        pElement.getAttributeNS(this.NAMESPACE, "space") ||
        pElement.getAttribute("w:space") ||
        "0";
      const color =
        pElement.getAttributeNS(this.NAMESPACE, "color") ||
        pElement.getAttribute("w:color") ||
        "000000";
      retval.color = "#" + color;
      retval.thickness = parseInt(sz, 10) / 8;
      retval.space = parseInt(space, 10);
    }
    return retval;
  }
  public parseCommonStyles(
    styleNode: Element,
    styleId: string,
    themeFonts?: ThemeFonts,
  ): BasicStyle {
    const s: BasicStyle = {
      fontFamily: this.defaultStyles?.fontFamily!,
      fontSize: this.defaultStyles?.fontSize!,
      bold: false,
      italics: false,
      color: "#000000",
      underline: "none",
      strike: false,

      allCaps: false,
      smallCaps: false,
      vertAlign: "baseline",

      align: "left",
      marginLeft: 0,
      marginRight: 0,
      firstLineIndent: 0,
      spaceBefore: 0,
      spaceAfter: 0,
      lineSpacing: 0,
      lineSpacingRule: "auto",
      contextualSpacing: true,
      outlineLevel: null,
      shadingColor: null,

      borderTop: null,
      borderBottom: null,

      styleId,
    };

    // ---------- RUN PROPERTIES (<w:rPr>) ----------
    const rPr = styleNode.getElementsByTagNameNS(this.NAMESPACE, "rPr")[0];

    if (rPr) {
      const size = rPr.getElementsByTagNameNS(this.NAMESPACE, "sz")[0];
      if (size) {
        const val = size.getAttributeNS(this.NAMESPACE, "val");
        if (val) s.fontSize = parseInt(val, 10) / 2; // half-points → pt
      }

      if (rPr.getElementsByTagNameNS(this.NAMESPACE, "b")[0]) s.bold = true;
      if (rPr.getElementsByTagNameNS(this.NAMESPACE, "i")[0]) s.italics = true;

      const underline = rPr.getElementsByTagNameNS(this.NAMESPACE, "u")[0];
      if (underline) {
        const v = underline.getAttributeNS(this.NAMESPACE, "val");
        if (v) s.underline = v;
      }

      const color = rPr.getElementsByTagNameNS(this.NAMESPACE, "color")[0];
      if (color) {
        const v = color.getAttributeNS(this.NAMESPACE, "val");
        if (v) {
          s.color = "#" + (v === "auto" ? "000000" : v);
        }
      }

      if (rPr.getElementsByTagNameNS(this.NAMESPACE, "strike")[0]) {
        s.strike = true;
      }

      if (rPr.getElementsByTagNameNS(this.NAMESPACE, "caps")[0]) {
        s.allCaps = true;
      }

      if (rPr.getElementsByTagNameNS(this.NAMESPACE, "smallCaps")[0]) {
        s.smallCaps = true;
      }

      const vertAlign = rPr.getElementsByTagNameNS(
        this.NAMESPACE,
        "vertAlign",
      )[0];
      if (vertAlign) {
        const v = vertAlign.getAttributeNS(this.NAMESPACE, "val");
        if (v === "superscript" || v === "subscript" || v === "baseline") {
          s.vertAlign = v;
        }
      }

      const fonts = rPr.getElementsByTagNameNS(this.NAMESPACE, "rFonts")[0];
      if (fonts && themeFonts) {
        // Simplified: use majorFont for Latin; refine if needed
        s.fontFamily = themeFonts.majorFont;
      }
    }

    // ---------- PARAGRAPH PROPERTIES (<w:pPr>) ----------
    const pPr = styleNode.getElementsByTagNameNS(this.NAMESPACE, "pPr")[0];
    if (pPr) {
      // alignment
      const jc = pPr.getElementsByTagNameNS(this.NAMESPACE, "jc")[0];
      if (jc) {
        const v =
          jc.getAttributeNS(this.NAMESPACE, "val") || jc.getAttribute("w:val");
        if (v === "center" || v === "right" || v === "left" || v === "both") {
          s.align = v === "both" ? "justify" : (v as any);
        }
      }

      // indents
      const ind = pPr.getElementsByTagNameNS(this.NAMESPACE, "ind")[0];
      if (ind) {
        const left =
          ind.getAttributeNS(this.NAMESPACE, "left") ||
          ind.getAttribute("w:left");
        const right =
          ind.getAttributeNS(this.NAMESPACE, "right") ||
          ind.getAttribute("w:right");
        const firstLine =
          ind.getAttributeNS(this.NAMESPACE, "firstLine") ||
          ind.getAttribute("w:firstLine");
        const hanging =
          ind.getAttributeNS(this.NAMESPACE, "hanging") ||
          ind.getAttribute("w:hanging");

        s.marginLeft = this.twipsToPt(left);
        s.marginRight = this.twipsToPt(right);

        if (firstLine) {
          s.firstLineIndent = this.twipsToPt(firstLine);
        } else if (hanging) {
          // hanging indent represented as negative first-line indent
          s.firstLineIndent = -this.twipsToPt(hanging);
        }
      }

      // spacing
      const spacing = pPr.getElementsByTagNameNS(this.NAMESPACE, "spacing")[0];
      if (spacing) {
        const before =
          spacing.getAttributeNS(this.NAMESPACE, "before") ||
          spacing.getAttribute("w:before");
        const after =
          spacing.getAttributeNS(this.NAMESPACE, "after") ||
          spacing.getAttribute("w:after");
        s.spaceBefore = this.twipsToPt(before);
        s.spaceAfter = this.twipsToPt(after);

        const line =
          spacing.getAttributeNS(this.NAMESPACE, "line") ||
          spacing.getAttribute("w:line");
        const lineRule =
          spacing.getAttributeNS(this.NAMESPACE, "lineRule") ||
          spacing.getAttribute("w:lineRule");
        if (line) {
          // line can be in twips or in 240-based units; common simple mapping:
          s.lineSpacing = this.twipsToPt(line);
        }
        if (
          lineRule === "auto" ||
          lineRule === "exact" ||
          lineRule === "atLeast"
        ) {
          s.lineSpacingRule = lineRule as any;
        }
      }
      const contextualSpacing = pPr.getElementsByTagNameNS(
        this.NAMESPACE,
        "contextualSpacing ",
      )[0];
      if (contextualSpacing) {
        s.contextualSpacing = true;
      }
      // outline level (for headings)
      const outlineLvl = pPr.getElementsByTagNameNS(
        this.NAMESPACE,
        "outlineLvl",
      )[0];
      if (outlineLvl) {
        const v =
          outlineLvl.getAttributeNS(this.NAMESPACE, "val") ||
          outlineLvl.getAttribute("w:val");
        if (v != null) {
          s.outlineLevel = parseInt(v, 10);
        }
      }

      // shading (background)
      const shd = pPr.getElementsByTagNameNS(this.NAMESPACE, "shd")[0];
      if (shd) {
        const fill =
          shd.getAttributeNS(this.NAMESPACE, "fill") ||
          shd.getAttribute("w:fill");
        if (fill && fill !== "auto" && fill !== "none") {
          s.shadingColor = "#" + fill;
        }
      }

      // borders
      const pBdr = pPr.getElementsByTagNameNS(this.NAMESPACE, "pBdr")[0];
      if (pBdr) {
        const top = pBdr.getElementsByTagNameNS(this.NAMESPACE, "top")[0];
        if (top) {
          s.borderTop = this.commonBorderHelper(top);
        }

        const bottom = pBdr.getElementsByTagNameNS(this.NAMESPACE, "bottom")[0];
        if (bottom) {
          s.borderBottom = this.commonBorderHelper(bottom);
        }
      }
    }

    return s;
  }
  private parseTableMarginsHelper(
    pTblCellMargin: Element,
    stylesMap: TableStyle,
    pSide: "top" | "left" | "right" | "bottom",
  ) {
    const side = pTblCellMargin.getElementsByTagNameNS(
      this.NAMESPACE,
      pSide,
    )[0];
    if (side) {
      const val = side.getAttributeNS(this.NAMESPACE, "w");
      if (val) stylesMap.margins!.top = this.twipsToPt(val);
    }
  }
  private parseTableMargins(pTblCellMargin: Element, stylesMap: TableStyle) {
    const sides: Array<"top" | "left" | "right" | "bottom"> = [
      "top",
      "left",
      "right",
      "bottom",
    ];
    sides.forEach((side) => {
      this.parseTableMarginsHelper(pTblCellMargin, stylesMap, side);
    });
  }

  private parseTableBorderHelper(
    pTblBorder: Element,
    pBorders: TableBordersObj,
    pSide: "top" | "left" | "right" | "bottom" | "insideH" | "insideV",
  ) {
    const side = pTblBorder.getElementsByTagNameNS(this.NAMESPACE, pSide)[0];
    if (side) {
      const val = side.getAttributeNS(this.NAMESPACE, "val");
      const size = side.getAttributeNS(this.NAMESPACE, "size");
      const color = side.getAttributeNS(this.NAMESPACE, "color");
      if (val) pBorders[pSide].style = val;
      if (size) pBorders[pSide].thickness = this.twipsToPt(size);
      if (color)
        pBorders[pSide].color = "#" + (color === "auto" ? "000000" : color);
    }
  }
  private parseTableBorder(pTblBorder: Element) {
    const sides: Array<
      "top" | "left" | "right" | "bottom" | "insideH" | "insideV"
    > = ["top", "left", "right", "bottom", "insideH", "insideV"];

    // all the values are assigned in initialization loop
    let borders: TableBordersObj = {} as TableBordersObj;
    sides.forEach((side) => {
      borders[side] = {
        style: "single",
        thickness: 0.5,
        color: "#000000",
      };
    });

    sides.forEach((side) => {
      this.parseTableBorderHelper(pTblBorder, borders, side);
    });
    return borders;
  }
  public parseTableStyles(styleNode: Element, stylesMap: StylesMap) {
    let s: TableStyle = {
      indent: 0,
      borders: undefined,
      margins: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    };
    const tblPr = styleNode.getElementsByTagNameNS(this.NAMESPACE, "tblPr")[0];

    const basedOn = styleNode.getElementsByTagNameNS(
      this.NAMESPACE,
      "basedOn",
    )[0];
    if (basedOn) {
      const val = basedOn.getAttributeNS(this.NAMESPACE, "val");
      if (val) {
        let inheritStyle = stylesMap[val];
        if (inheritStyle) {
          s = {
            ...s,
            ...inheritStyle,
          };
        }
      }
    }
    if (tblPr) {
      const tblInd = tblPr.getElementsByTagNameNS(this.NAMESPACE, "tblInd")[0];
      if (tblInd) {
        const val = tblInd.getAttributeNS(this.NAMESPACE, "w");
        if (val) s.indent = this.twipsToPt(val);
      }
      const tblCellMar = tblPr.getElementsByTagNameNS(
        this.NAMESPACE,
        "tblCellMar",
      )[0];
      if (tblCellMar) {
        this.parseTableMargins(tblCellMar, s);
      }
      const tblBorders = styleNode.getElementsByTagNameNS(
        this.NAMESPACE,
        "tblBorders",
      )[0];
      if (tblBorders) {
        s.borders = this.parseTableBorder(tblBorders);
      }
    }

    return s;
  }
  defaultStyles: BasicStyle | null;
  themeFonts: ThemeFonts;
  private _vParser: DOMParser;
  private _vStylesDOM: Document;
  private _vStylesMap: StylesMap;

  NAMESPACE = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
}
