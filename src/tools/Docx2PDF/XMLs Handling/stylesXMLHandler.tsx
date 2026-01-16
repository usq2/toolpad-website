import { BasicStyle, StylesMap, TableStyle, ThemeFonts } from "../types/types";

// Need to further improve it by mapping all styles while class creation
export class Styles {
  constructor(pStylesXML: string, pThemeFonts: ThemeFonts) {
    this._vParser = new DOMParser();
    this._vStylesDOM = this._vParser.parseFromString(
      pStylesXML,
      "application/xml"
    );
    this.themeFonts = pThemeFonts;
    this.defaultStyles = this.getDefaultStyles();
    this._vStylesMap = this.getAllStyles();
  }

  private getDefaultStyles() {
    const defaultStyleNode = Array.from(
      this._vStylesDOM.getElementsByTagNameNS(this.NAMESPACE, "docDefaults")
    );
    let runDefaults = Array.from(
      defaultStyleNode[0].getElementsByTagNameNS(this.NAMESPACE, "rPrDefault")
    );
    let defaultStyle: BasicStyle | null = this.parseCommonStyles(
      runDefaults[0],
      "default",
      this.themeFonts
    );
    return defaultStyle;
  }
  private getAllStyles() {
    const stylesMap: StylesMap = {};
    const styles = this._vStylesDOM.getElementsByTagNameNS(
      this.NAMESPACE,
      "style"
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
          this.themeFonts
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

  public parseCommonStyles(
    styleNode: Element,
    styleId: string,
    themeFonts?: ThemeFonts
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
        "vertAlign"
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
        "contextualSpacing "
      )[0];
      if (contextualSpacing) {
        s.contextualSpacing = true;
      }
      // outline level (for headings)
      const outlineLvl = pPr.getElementsByTagNameNS(
        this.NAMESPACE,
        "outlineLvl"
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
          const val =
            top.getAttributeNS(this.NAMESPACE, "val") ||
            top.getAttribute("w:val");
          if (val && val !== "nil") {
            const sz =
              top.getAttributeNS(this.NAMESPACE, "sz") ||
              top.getAttribute("w:sz") ||
              "0";
            const space =
              top.getAttributeNS(this.NAMESPACE, "space") ||
              top.getAttribute("w:space") ||
              "0";
            const color =
              top.getAttributeNS(this.NAMESPACE, "color") ||
              top.getAttribute("w:color") ||
              "000000";
            s.borderTop = {
              color: "#" + color,
              thickness: parseInt(sz, 10) / 8,
              space: parseInt(space, 10),
            };
          }
        }

        const bottom = pBdr.getElementsByTagNameNS(this.NAMESPACE, "bottom")[0];
        if (bottom) {
          const val =
            bottom.getAttributeNS(this.NAMESPACE, "val") ||
            bottom.getAttribute("w:val");
          if (val && val !== "nil") {
            const sz =
              bottom.getAttributeNS(this.NAMESPACE, "sz") ||
              bottom.getAttribute("w:sz") ||
              "0";
            const space =
              bottom.getAttributeNS(this.NAMESPACE, "space") ||
              bottom.getAttribute("w:space") ||
              "0";
            const color =
              bottom.getAttributeNS(this.NAMESPACE, "color") ||
              bottom.getAttribute("w:color") ||
              "000000";
            s.borderBottom = {
              color: "#" + color,
              thickness: parseInt(sz, 10) / 8,
              space: parseInt(space, 10),
            };
          }
        }
      }
    }

    return s;
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
      "basedOn"
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
        "tblCellMar"
      )[0];
      if (tblCellMar) {
        const top = tblCellMar.getElementsByTagNameNS(this.NAMESPACE, "top")[0];
        if (top) {
          const val = top.getAttributeNS(this.NAMESPACE, "w");
          if (val) s.margins!.top = this.twipsToPt(val);
        }
        const left = tblCellMar.getElementsByTagNameNS(
          this.NAMESPACE,
          "left"
        )[0];
        if (left) {
          const val = top.getAttributeNS(this.NAMESPACE, "w");
          if (val) s.margins!.left = this.twipsToPt(val);
        }
        const bottom = tblCellMar.getElementsByTagNameNS(
          this.NAMESPACE,
          "bottom"
        )[0];
        if (bottom) {
          const val = top.getAttributeNS(this.NAMESPACE, "w");
          if (val) s.margins!.bottom = this.twipsToPt(val);
        }
        const right = tblCellMar.getElementsByTagNameNS(
          this.NAMESPACE,
          "right"
        )[0];
        if (right) {
          const val = top.getAttributeNS(this.NAMESPACE, "w");
          if (val) s.margins!.right = this.twipsToPt(val);
        }
      }
      const tblBorders = styleNode.getElementsByTagNameNS(
        this.NAMESPACE,
        "tblBorders"
      )[0];
      if (tblBorders) {
        let borders = {
          top: { style: "single", thickness: 0.5, color: "#000000" },
          bottom: { style: "single", thickness: 0.5, color: "#000000" },
          left: { style: "single", thickness: 0.5, color: "#000000" },
          right: { style: "single", thickness: 0.5, color: "#000000" },
          insideH: { style: "single", thickness: 0.5, color: "#000000" },
          insideV: { style: "single", thickness: 0.5, color: "#000000" },
        };
        const top = tblBorders.getElementsByTagNameNS(this.NAMESPACE, "top")[0];
        if (top) {
          const val = top.getAttributeNS(this.NAMESPACE, "val");
          const size = top.getAttributeNS(this.NAMESPACE, "size");
          const color = top.getAttributeNS(this.NAMESPACE, "color");
          if (val) borders.top.style = val;
          if (size) borders.top.thickness = this.twipsToPt(size);
          if (color)
            borders.top.color = "#" + (color === "auto" ? "000000" : color);
        }
        const left = tblBorders.getElementsByTagNameNS(
          this.NAMESPACE,
          "left"
        )[0];
        if (left) {
          const val = left.getAttributeNS(this.NAMESPACE, "val");
          const size = left.getAttributeNS(this.NAMESPACE, "size");
          const color = left.getAttributeNS(this.NAMESPACE, "color");
          if (val) borders.left.style = val;
          if (size) borders.left.thickness = this.twipsToPt(size);
          if (color)
            borders.left.color = "#" + (color === "auto" ? "000000" : color);
        }
        const bottom = tblBorders.getElementsByTagNameNS(
          this.NAMESPACE,
          "bottom"
        )[0];
        if (bottom) {
          const val = bottom.getAttributeNS(this.NAMESPACE, "val");
          const size = bottom.getAttributeNS(this.NAMESPACE, "size");
          const color = bottom.getAttributeNS(this.NAMESPACE, "color");
          if (val) borders.bottom.style = val;
          if (size) borders.bottom.thickness = this.twipsToPt(size);
          if (color)
            borders.bottom.color = "#" + (color === "auto" ? "000000" : color);
        }
        const right = tblBorders.getElementsByTagNameNS(
          this.NAMESPACE,
          "right"
        )[0];
        if (right) {
          const val = right.getAttributeNS(this.NAMESPACE, "val");
          const size = right.getAttributeNS(this.NAMESPACE, "size");
          const color = right.getAttributeNS(this.NAMESPACE, "color");
          if (val) borders.right.style = val;
          if (size) borders.right.thickness = this.twipsToPt(size);
          if (color)
            borders.right.color = "#" + (color === "auto" ? "000000" : color);
        }
        const insideH = tblBorders.getElementsByTagNameNS(
          this.NAMESPACE,
          "insideH"
        )[0];
        if (insideH) {
          const val = insideH.getAttributeNS(this.NAMESPACE, "val");
          const size = insideH.getAttributeNS(this.NAMESPACE, "size");
          const color = insideH.getAttributeNS(this.NAMESPACE, "color");
          if (val) borders.insideH.style = val;
          if (size) borders.insideH.thickness = this.twipsToPt(size);
          if (color)
            borders.insideH.color = "#" + (color === "auto" ? "000000" : color);
        }
        const insideV = tblBorders.getElementsByTagNameNS(
          this.NAMESPACE,
          "insideV"
        )[0];
        if (insideV) {
          const val = insideV.getAttributeNS(this.NAMESPACE, "val");
          const size = insideV.getAttributeNS(this.NAMESPACE, "size");
          const color = insideV.getAttributeNS(this.NAMESPACE, "color");
          if (val) borders.insideV.style = val;
          if (size) borders.insideV.thickness = this.twipsToPt(size);
          if (color)
            borders.insideV.color = "#" + (color === "auto" ? "000000" : color);
        }
        s.borders = borders;
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
