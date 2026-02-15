import { Styles } from "./stylesXMLHandler";
import {
  BasicStyle,
  ListElement,
  ElementTypes,
  Content,
  Paragraph,
  TableCell,
  TableElement,
  TableRow,
  Image,
  NumberingMap,
} from "../types/types";
import { FilePath } from "../filePathMap";
import JSZip from "jszip";

//extract runs for a basic case
/*
 * The basic case makes the following assumptions
 * 1. there is only one section in document
 * 2. there is only text in document
 */
export class DocumentParser {
  constructor(
    pDocumentXML: string,
    pStyles: Styles,
    pZip: JSZip,
    pNumbersMap: NumberingMap | undefined,
  ) {
    this._vParser = new DOMParser();
    this._vStyles = pStyles;
    this._vDocDOM = this._vParser.parseFromString(
      pDocumentXML,
      "application/xml",
    );
    this._vNumbersMap = pNumbersMap;
    this._vZip = pZip;
    this._vRelsContent = null;
  }

  async getContent(): Promise<Content> {
    const body = this._vDocDOM.getElementsByTagName("w:body")[0];
    if (!body) return [];

    const content: Content = [];
    // Iterate through children of body to maintain document order (p, tbl, etc.)
    const nodes = Array.from(body.childNodes);

    for (const node of nodes) {
      if (node.nodeType !== 1) continue; // Skip text/comment nodes
      const el = node as Element;
      const tagName = el.localName;

      switch (tagName) {
        case "p":
          const pResult = await this.parseParagraph(el);
          if (pResult) content.push(pResult);
          break;
        case "tbl":
          const tblResult = this.parseTable(el);
          if (tblResult) content.push(tblResult);
          break;
      }
    }
    return content;
  }

  private async parseParagraph(
    p: Element,
  ): Promise<Paragraph | ListElement | Image | null> {
    const styleId = this.getAttr(
      p.getElementsByTagName("w:pStyle")[0],
      "w:val",
    );
    const styles = styleId
      ? this._vStyles.getStyleById(styleId)
      : this._vStyles.defaultStyles!;

    // 1. Check if List
    const numPr = p.getElementsByTagName("w:numPr")[0];
    if (numPr && this._vNumbersMap) {
      return this.getLists(numPr, p, styles!);
    }

    // 2. Process Runs (Text and Images)
    const runs = Array.from(p.getElementsByTagName("w:r"));
    for (const run of runs) {
      // Handle Images
      const drawing = run.getElementsByTagName("w:drawing")[0];
      if (drawing) {
        return await this.getImages([drawing]); // Returning first image found in p
      }

      // Handle Text
      const t = run.getElementsByTagName("w:t")[0];
      if (t) {
        return {
          type: ElementTypes.PARAGRAPH,
          alignment: "left", // Should be extracted from pPr > jc
          text: t.textContent || "",
          ...styles,
        };
      }
    }
    return null;
  }
  private parseTable(tbl: Element): TableElement {
    const rows: TableRow[] = [];
    const trs = Array.from(tbl.getElementsByTagName("w:tr"));

    // Extract Grid
    const gridCols = Array.from(tbl.getElementsByTagName("w:gridCol")).map(
      (col) => this.twipsToPoints(this.getAttr(col, "w:w")),
    );

    for (let i = 0; i < trs.length; i++) {
      rows.push(this.parseTableRow(trs[i], gridCols, i));
    }
    const styleId =
      this.getAttr(tbl.querySelector("tblStyle"), "w:val") || "TableNormal";
    return {
      type: ElementTypes.TABLE,
      rows,
      gridColumns: gridCols,
      styles: this._vStyles.getStyleById(styleId),
    };
  }

  private parseTableRow(tr: Element, gridCols: number[]): TableRow {
    const cells: TableCell[] = [];
    const tcs = Array.from(tr.getElementsByTagName("w:tc"));

    tcs.forEach((tc, colIdx) => {
      cells.push(this.parseTableCell(tc, gridCols[colIdx] || 0));
    });
    return {
      cells,
      style: {
        height: this.twipsToPoints(
          this.getAttr(tr.querySelector("trHeight"), "w:val"),
        ),
      },
    };
  }

  private parseTableCell(tc: Element, defaultWidth: number): TableCell {
    const tcPr = tc.getElementsByTagName("w:tcPr")[0];

    // Extract cell content recursively
    const paragraphs = Array.from(tc.getElementsByTagName("w:p"));
    const cellContent = [];
    paragraphs.forEach(async (para) => {
      cellContent.push(await this.parseParagraph(para));
    });
    return {
      content: cellContent,
      style: {
        width:
          this.twipsToPoints(this.getAttr(tcPr?.querySelector("tcW"), "w:w")) ||
          defaultWidth,
        vAlign:
          (this.getAttr(tcPr?.querySelector("vAlign"), "w:val") as any) ||
          "top",
        backgroundColor:
          this.getAttr(tcPr?.querySelector("shd"), "w:fill") || undefined,
      },
    };
  }

  private twipsToPoints(value: string) {
    return value ? parseInt(value) / 20 : null;
  }
  private getAttr(el: Element | undefined, attrName: string): string | null {
    if (!el) return null;
    return (
      el.getAttribute(attrName) ||
      el.getAttribute(attrName.split(":")[1]) ||
      null
    );
  }
  sectionDimensions() {
    const sectPr = Array.from(this._vDocDOM.getElementsByTagName("w:sectPr"));
    const pageSize = sectPr[0].getElementsByTagName("w:pgSz")[0];
    const pageMar = sectPr[0].getElementsByTagName("w:pgMar")[0];
    return {
      pageWidth: this.twipsToPoints(
        pageSize?.getAttribute("w:w") || this.DEFAULT_PAGE_HEIGHT,
      ),
      pageHeight: this.twipsToPoints(
        pageSize?.getAttribute("w:h") || this.DEFAULT_PAGE_WIDTH,
      ),
      marginTop: this.twipsToPoints(
        pageMar?.getAttribute("w:top") || this.DEFAULT_MARGIN_TOP,
      ),
      marginBottom: this.twipsToPoints(
        pageMar?.getAttribute("w:bottom") || this.DEFAULT_MARGIN_BOTTOM,
      ),
      marginLeft: this.twipsToPoints(
        pageMar?.getAttribute("w:left") || this.DEFAULT_MARGIN_LEFT,
      ),
      marginRight: this.twipsToPoints(
        pageMar?.getAttribute("w:right") || this.DEFAULT_MARGIN_RIGHT,
      ),
    };
  }

  private async getRelsContent() {
    const rels = await this._vZip.file(FilePath.RELS)?.async("string");

    if (!rels) {
      return null;
    }
    const relationships = new Map<string, string>();

    const doc = new DOMParser().parseFromString(rels, "application/xml");
    // all tags under relationship , in order to get the images
    const relNodes = doc.getElementsByTagName("Relationship");

    for (let i = 0; i < relNodes.length; i++) {
      const rel = relNodes.item(i);
      if (!rel) continue;

      const type = rel.getAttribute("Type") ?? "";
      if (type.includes("/image")) {
        const id = rel.getAttribute("Id");
        const target = rel.getAttribute("Target");
        if (id && target) {
          // maintain a map of relationships
          relationships.set(id, target);
        }
      }
    }
    return relationships;
  }
  private getRelId(pImages: Element[]) {
    const wpInline =
      pImages[0].getElementsByTagName("wp:inline") ||
      pImages[0].getElementsByTagName("wp:anchor");

    if (!wpInline) return null;
    const aGraphic = wpInline[0].getElementsByTagName("a:graphic");
    if (!aGraphic) return null;

    const aGraphicData = aGraphic[0].getElementsByTagName("a:graphicData");
    if (!aGraphicData) return null;

    const picPic = aGraphicData[0]?.getElementsByTagName("pic:pic");
    if (!picPic) return null;

    const picBlipFill = picPic[0]?.getElementsByTagName("pic:blipFill");
    if (!picBlipFill) return null;

    const aBlip = picBlipFill[0]?.getElementsByTagName("a:blip");
    if (!aBlip) return null;

    return aBlip[0].getAttribute("r:embed") || null;
  }
  private getImageDimensions(pImages: Element[]) {
    const inlineEl = pImages[0].getElementsByTagName("wp:inline")[0];
    if (!inlineEl) return null;

    // <wp:extent cx="..." cy="..."/>
    const extentEl = inlineEl.getElementsByTagName("wp:extent")[0];
    if (!extentEl) return null;

    const cxAttr = extentEl.getAttribute("cx");
    const cyAttr = extentEl.getAttribute("cy");
    if (!cxAttr || !cyAttr) return null;

    const cx = parseInt(cxAttr, 10);
    const cy = parseInt(cyAttr, 10);
    return { cx, cy };
  }

  private getImageFormat(pImagePath: string) {
    const ext = pImagePath.toLowerCase().split(".").pop();
    if (ext === "png") return "png";
    if (ext === "jpg" || ext === "jpeg") return "jpeg";
    // Default to jpeg for unrecognized formats
    return "jpeg";
  }

  private async getImages(pImages: Element[]) {
    if (!this._vRelsContent) {
      this._vRelsContent = await this.getRelsContent();
    }
    const relId = this.getRelId(pImages);

    if (!relId || !this._vRelsContent?.has(relId)) {
      return null;
    }
    const imagePath = `word/${this._vRelsContent.get(relId)}`;
    const imageBuffer = await this._vZip.file(imagePath)?.async("arraybuffer");
    if (!imageBuffer) {
      return null;
    }
    const dimensions = this.getImageDimensions(pImages);
    if (!dimensions) {
      return null;
    }
    const format = this.getImageFormat(imagePath);
    if (!format) {
      return null;
    }
    const imageElement: Image = {
      type: ElementTypes.IMAGE,
      data: new Uint8Array(imageBuffer!),
      width: dimensions.cx / 12700,
      height: dimensions.cy / 12700,
      format,
    };
    return imageElement;
  }

  private getLists(pNumPr: Element, pPara: Element, pStyles: BasicStyle) {
    if (!pNumPr || !this._vNumbersMap || !pPara) {
      return null;
    }
    const ilvlEl = pNumPr.getElementsByTagName("w:ilvl")[0];
    const numIdEl = pNumPr.getElementsByTagName("w:numId")[0];
    if (!ilvlEl || !numIdEl) return null;

    const ilvl = parseInt(ilvlEl.getAttribute("w:val") || "0", 10);
    const numId = parseInt(numIdEl.getAttribute("w:val") || "0", 10);

    const lvlMap = this._vNumbersMap.get(numId);
    const lvlInfo = lvlMap?.get(ilvl);

    const numFmt = lvlInfo?.numFmt || "bullet";
    const listType: "bullet" | "number" =
      numFmt === "bullet" ? "bullet" : "number";

    // text from runs
    let text = "";
    const runs = pPara.getElementsByTagName("w:r");
    for (let i = 0; i < runs.length; i++) {
      const t = runs[i].getElementsByTagName("w:t")[0];
      if (t?.textContent) text += t.textContent;
    }
    text = text.replace(/\s+/g, " ").trim();
    let {
      fontFamily,
      fontSize,
      bold,
      italics,
      color,
      underline,
      strike,
      marginLeft,
      contextualSpacing,
      styleId,
      spaceBefore,
      spaceAfter,
    } = pStyles;
    const listItem: ListElement = {
      type: ElementTypes.LIST,
      text,
      fontFamily,
      fontSize,
      bold,
      italics,
      color,
      underline,
      strike,
      listType,
      level: ilvl,
      numId,
      marginLeft,
      contextualSpacing,
      spaceBefore: spaceBefore ? spaceBefore : 0,
      spaceAfter: spaceAfter ? spaceAfter : 0,
      styleId,
    };
    return listItem;
  }

  //   private _vRuns: runs;
  private _vStyles: Styles;
  private _vParser: DOMParser;
  private _vDocDOM: Document;
  private _vZip: JSZip;
  private _vRelsContent: Map<string, string> | null;
  private _vNumbersMap: NumberingMap | undefined;

  private DEFAULT_PAGE_HEIGHT = "15840";
  private DEFAULT_PAGE_WIDTH = "12240";

  private DEFAULT_MARGIN_TOP = "1440";
  private DEFAULT_MARGIN_BOTTOM = "1440";

  private DEFAULT_MARGIN_RIGHT = "1440";
  private DEFAULT_MARGIN_LEFT = "1440";
}
