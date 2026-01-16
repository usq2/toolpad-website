import { PDFDocument, PDFPage, StandardFonts, rgb, PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import {
  JSONStruct,
  PDFConfig,
  TextElement,
  ListElement,
  ImageElement,
  TableElement,
  ElementTypes,
} from "../types/types";

export class PDFBuilder {
  constructor(config: PDFConfig = {}) {
    this.config = {
      pageWidth: config.pageWidth || 612, // Letter width
      pageHeight: config.pageHeight || 792, // Letter height
      marginTop: config.marginTop || 50,
      marginBottom: config.marginBottom || 50,
      marginLeft: config.marginLeft || 50,
      marginRight: config.marginRight || 50,
      lineHeight: config?.lineHeight || 1.2,
    };

    this.doc = PDFDocument.create();
    this.currentY = this.config.marginTop;
    this.fontKitLoaded = false;
    this.initializing = false;
  }

  // MUST be called before addElements/addElement/build
  public async init() {
    if (this.initialized || this.initializing) return;
    try {
      this.initializing = true;
      this.doc = await PDFDocument.create();
      if (!this.fontKitLoaded) {
        this.doc.registerFontkit(fontkit); // enable custom fonts
        this.fontKitLoaded = true;
      }
      await this.loadFonts();
      // You can add Times, Courier, etc., similarly if needed

      this.initialized = true;
      this.currentY = this.config.marginTop;
      // Add first page
      this.doc.addPage([this.config.pageWidth, this.config.pageHeight]);
    } finally {
      this.initializing = false;
    }
  }

  async embedWebFont(pUrl: string) {
    const fontBytes = await this.loadFontBytes(pUrl);
    return this.doc.embedFont(fontBytes); // returns PDFFont
  }
  async loadFontBytes(pUrl: string): Promise<ArrayBuffer> {
    const res = await fetch(pUrl);
    const buf = await res.arrayBuffer();
    return buf;
    // return new Uint8Array(buf);
  }
  private async loadFonts() {
    const helvetica = await this.doc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await this.doc.embedFont(StandardFonts.HelveticaBold);
    const helveticaOblique = await this.doc.embedFont(
      StandardFonts.HelveticaOblique
    );
    const helveticaBoldOblique = await this.doc.embedFont(
      StandardFonts.HelveticaBoldOblique
    );
    const InterBold = await this.embedWebFont("/fonts/Inter/Inter-Bold.ttf");
    const InterBoldItalic = await this.embedWebFont(
      "/fonts/Inter/Inter-BoldItalic.ttf"
    );
    const InterItalic = await this.embedWebFont(
      "/fonts/Inter/Inter-Italic.ttf"
    );
    const InterRegular = await this.embedWebFont(
      "/fonts/Inter/Inter-Regular.ttf"
    );

    this.fonts.set("Helvetica", helvetica);
    this.fonts.set("Helvetica-Bold", helveticaBold);
    this.fonts.set("Helvetica-Italic", helveticaOblique);
    this.fonts.set("Helvetica-BoldItalic", helveticaBoldOblique);

    this.fonts.set("Inter-Regular", InterRegular);
    this.fonts.set("Inter-Bold", InterBold);
    this.fonts.set("Inter-Italic", InterItalic);
    this.fonts.set("Inter-BoldItalic", InterBoldItalic);
  }

  private parseColor(hex: string): [number, number, number] {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
    const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
    const b = parseInt(cleanHex.slice(4, 6), 16) / 255;
    return [r, g, b];
  }

  private getAvailableWidth(): number {
    return (
      this.config.pageWidth - this.config.marginLeft - this.config.marginRight
    );
  }

  private resolveFontKey(
    family: string,
    bold: boolean,
    italics: boolean
  ): string {
    const base = family || "Helvetica";

    if (base.includes("Aptos")) {
      if (bold && italics) return "Inter-BoldItalic";
      if (bold) return "Inter-Bold";
      if (italics) return "Inter-Italic";
      return "Inter-Regular";
    }
    if (base === "Helvetica") {
      if (bold && italics) return "Helvetica-BoldOblique";
      if (bold) return "Helvetica-Bold";
      if (italics) return "Helvetica-Oblique";
      return "Helvetica";
    }

    // Fallback: everything else uses Helvetica
    if (bold && italics) return "Helvetica-BoldOblique";
    if (bold) return "Helvetica-Bold";
    if (italics) return "Helvetica-Oblique";
    return "Helvetica";
  }

  private getFont(family: string, bold: boolean, italics: boolean): PDFFont {
    const key = this.resolveFontKey(family, bold, italics);
    const font = this.fonts.get(key);
    if (!font) {
      throw new Error(
        `Font ${key} not loaded. Available: ${Array.from(
          this.fonts.keys()
        ).join(", ")}`
      );
    }
    return font;
  }

  private wrapText(text: string, fontSize: number, font: PDFFont): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    const availableWidth = this.getAvailableWidth();

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);

      if (width > availableWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) lines.push(currentLine);
    return lines;
  }

  private async getCurrentPage(): Promise<PDFPage> {
    if (this.pageIndex >= this.doc.getPageCount()) {
      const page = this.doc.addPage([
        this.config.pageWidth,
        this.config.pageHeight,
      ]);
      return page;
    }
    return this.doc.getPage(this.pageIndex);
  }

  private checkPageBreak(lineHeight: number) {
    const usableHeight =
      this.config.pageHeight - this.config.marginTop - this.config.marginBottom;

    // If current position + line height exceeds usable area, add new page
    if (this.currentY + lineHeight > this.config.marginTop + usableHeight) {
      this.pageIndex += 1;
      this.currentY = this.config.marginTop; // Reset to top margin of new page
    }
  }

  public async addElement(el: TextElement): Promise<this> {
    if (!this.initialized) {
      throw new Error("PDFBuilder.init() must be called before addElement");
    }

    const font = this.getFont(el.fontFamily, el.bold, el.italics);

    const [r, g, b] = this.parseColor(el.color || "#000000");

    // ---- paragraph spacing BEFORE ----
    if (el.contextualSpacing && el.styleId === this.lastParagraphStyleId) {
    } else if (el.spaceBefore && el.spaceBefore > 0) {
      this.currentY += el.spaceBefore;
      this.lastParagraphStyleId = el.styleId;
    }

    const marginLeft = this.config.marginLeft + (el.marginLeft || 0);
    const marginRight = this.config.marginRight + (el.marginRight || 0);
    const maxWidth = this.config.pageWidth - marginLeft - marginRight;
    const firstLineIndent = el.firstLineIndent || 0;
    const baseLineHeight = el.fontSize * this.config.lineHeight;
    const lineHeight = baseLineHeight;

    const lines = this.wrapText(el.text, el.fontSize, font);

    // Pre‑compute total text block height (without spaceBefore/After)
    const paraHeight = lines.length * lineHeight;

    // ---- TOP BORDER (just above first line) ----
    if (el.borderTop) {
      const page = await this.getCurrentPage();
      const [br, bg, bb] = this.parseColor(el.borderTop.color);
      const width = maxWidth;
      const yBorder =
        this.config.pageHeight - this.currentY + el.borderTop.space;
      page.drawLine({
        start: { x: marginLeft, y: yBorder },
        end: { x: marginLeft + width, y: yBorder },
        thickness: el.borderTop.thickness,
        color: rgb(br, bg, bb),
      });
      this.currentY += el.borderTop.space;
    }

    // ---- draw lines ----
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      this.checkPageBreak(lineHeight);
      const page = await this.getCurrentPage();

      const yInPDF = this.config.pageHeight - this.currentY;

      const marginLeft = this.config.marginLeft + (el.marginLeft || 0);
      const marginRight = this.config.marginRight + (el.marginRight || 0);
      const boxWidth = this.config.pageWidth - marginLeft - marginRight;

      const indent = el.firstLineIndent || 0;
      const baseLeft = marginLeft + indent;
      const usableWidth = boxWidth - indent; // width for the text itself
      let textWidth = font.widthOfTextAtSize(line, el.fontSize);
      if (!textWidth || textWidth < 0.01) {
        textWidth = usableWidth; // treat as full line to avoid visible shift
      }
      let x = baseLeft;

      if (el.align === "center") {
        x = baseLeft + (usableWidth - textWidth) / 2;
      } else if (el.align === "right") {
        x = baseLeft + (usableWidth - textWidth);
      }

      page.drawText(line, {
        x,
        y: yInPDF,
        size: el.fontSize,
        font,
        color: rgb(r, g, b),
      });

      if (el.underline && el.underline !== "none") {
        const underlineY = yInPDF - 2;
        page.drawLine({
          start: { x, y: underlineY },
          end: { x: x + textWidth, y: underlineY },
          thickness: 0.5,
          color: rgb(r, g, b),
        });
      }

      if (el.strike) {
        const strikeY = yInPDF - el.fontSize / 2;
        page.drawLine({
          start: { x, y: strikeY },
          end: { x: x + textWidth, y: strikeY },
          thickness: 0.5,
          color: rgb(r, g, b),
        });
      }

      this.currentY += lineHeight;
    }

    // ---- BOTTOM BORDER (just under last line) ----
    if (el.borderBottom) {
      const page = await this.getCurrentPage();
      const [br, bg, bb] = this.parseColor(el.borderBottom.color);
      const width = maxWidth;

      // Y of last line baseline:
      const lastLineBaseY =
        this.config.pageHeight - (this.currentY - lineHeight);
      const yBorder = lastLineBaseY - el.borderBottom.space;

      page.drawLine({
        start: { x: marginLeft, y: yBorder },
        end: { x: marginLeft + width, y: yBorder },
        thickness: el.borderBottom.thickness,
        color: rgb(br, bg, bb),
      });
    }

    // ---- paragraph spacing AFTER (after border) ----
    if (el.spaceAfter && el.spaceAfter > 0) {
      this.currentY += el.spaceAfter;
    }
    return this;
  }

  public async addElements(elements: JSONStruct): Promise<this> {
    //this is wrong,
    // based on content.type will need to add different elements
    const sections = elements.document.sections;
    for (let content of sections) {
      if (content.type === ElementTypes.PARAGRAPH) {
        await this.addElement(content);
      } else if (content.type === ElementTypes.IMAGE) {
        await this.addImage(content);
      } else if (content.type === ElementTypes.LIST) {
        await this.addList(content);
      } else if (content.type === ElementTypes.TABLE) {
        await this.addTable(content);
      }
    }
    return this;
  }

  public async addSpacing(points: number = 12): Promise<this> {
    this.currentY += points;
    return this;
  }

  // Extensible methods
  public async addList(listEl: ListElement): Promise<this> {
    if (!this.initialized) {
      throw new Error("PDFBuilder.init() must be called before addList");
    }

    const fontSize = listEl.fontSize || 11;
    const fontFamily = listEl.fontFamily || "Helvetica";
    const [r, g, b] = this.parseColor(listEl.color || "#000000");
    const font = this.getFont(fontFamily, false, false);
    const lineHeight = fontSize * this.config.lineHeight;
    const levelIndent = listEl.level * listEl.marginLeft!; // from list level
    const manualIndent = listEl.marginLeft || 18; // from w:ind
    const baseLeft = this.config.marginLeft + levelIndent! + manualIndent;

    const lines = this.wrapText(listEl.text, listEl.fontSize!, font);

    const gap = 8;
    if (
      listEl.contextualSpacing &&
      listEl.styleId === this.lastParagraphStyleId
    ) {
    } else if (listEl.spaceBefore && listEl.spaceBefore > 0) {
      this.currentY += listEl.spaceBefore;
      this.lastParagraphStyleId = listEl.styleId;
    }
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      this.checkPageBreak(lineHeight);
      const page = await this.getCurrentPage();
      const y = this.config.pageHeight - this.currentY;
      if (i === 0) {
        if (listEl.listType === "bullet") {
          await this.drawBullet(
            page,
            baseLeft,
            y,
            listEl.fontSize,
            listEl.color,
            lineHeight,
            listEl.level
          );
        }
        const textX = baseLeft + listEl.fontSize + gap;
        page.drawText(line, {
          x: textX,
          y,
          size: listEl.fontSize,
          font,
          color: rgb(r, g, b),
        });
      } else {
        // wrapped lines align with text, not bullet
        const textX = baseLeft + listEl.fontSize + gap;
        page.drawText(line, {
          x: textX,
          y,
          size: listEl.fontSize,
          font,
          color: rgb(r, g, b),
        });
      }
      this.currentY += lineHeight;
    }
    if (listEl.spaceAfter && listEl.spaceAfter > 0) {
      this.currentY += listEl.spaceAfter;
    }
    return this;
  }
  async drawBullet(
    page: PDFPage,
    x: number,
    y: number,
    size: number,
    color: string,
    lineHeight: number,
    indentLevel: number
  ) {
    const radius = size / 6;
    const cx = x + radius;
    const cy = y + lineHeight / 2 - radius;
    const [r, g, b] = this.parseColor(color || "#000000");

    switch (indentLevel % 3) {
      case 1:
        // disc
        page.drawCircle({
          x: cx,
          y: cy,
          size: radius,
          color: rgb(r, g, b),
          borderWidth: 0.5,
          opacity: 0,
        });
        break;

      case 2:
        // small square
        page.drawRectangle({
          x: cx,
          // special handling needed for y
          y: cy - radius,
          width: radius * 2,
          height: radius * 2,
          color: rgb(r, g, b),
        });
        break;
      default:
        // circle
        page.drawCircle({
          x: cx,
          y: cy,
          size: radius,
          color: rgb(r, g, b),
        });
        break;
    }
  }

  public async addTable(table: TableElement): Promise<this> {
    if (!this.initialized) throw new Error("PDFBuilder.init() must be called");

    const tableLeft = this.config.marginLeft;
    const availableWidth =
      this.config.pageWidth - this.config.marginLeft - this.config.marginRight;

    // 1. Calculate Column Widths
    const columnWidths = table.gridColumns.map((colWidth, idx) => {
      // If table has specific grid widths, use them, otherwise distribute available width
      return colWidth || availableWidth / table.rows[0].cells.length;
    });
    for (let rowIdx = 0; rowIdx < table.rows.length; rowIdx++) {
      const row = table.rows[rowIdx];
      const page = await this.getCurrentPage();

      // Save starting Y to calculate the final height of this row
      const rowStartY = this.currentY;
      let maxCellBottomY = rowStartY;

      // 2. First Pass: Render Content and determine Row Height
      // We must track the X position for each cell
      const cellContentsHeight: number[] = [];
      let curColLeftMargin = 0;
      for (let colIdx = 0; colIdx < row.cells.length; colIdx++) {
        const cell = row.cells[colIdx];
        const colWidth = columnWidths[colIdx];

        const margin = cell.style.margins || table.styles.margins;

        this.currentY = rowStartY + margin.top!;
        // Render text elements
        for (const textEl of cell.content) {
          // We assume addElement updates this.currentY as it draws
          await this.addElement({
            ...textEl,
            // // should be sum of all column widths till here
            marginLeft: curColLeftMargin + colWidth / 5,
            // Pass maxWidth to addElement so text wraps within the cell
          });
        }

        this.currentY += margin.bottom!;
        cellContentsHeight[colIdx] = this.currentY - rowStartY;
        if (this.currentY > maxCellBottomY) maxCellBottomY = this.currentY;
        curColLeftMargin += colWidth;
      }
      // Determine final height for this row (max of defined height or content height)
      const finalRowHeight = Math.max(
        row.style.height || 0,
        maxCellBottomY - rowStartY
      );
      // 3. Second Pass: Draw Backgrounds and Borders
      curColLeftMargin = tableLeft;
      for (let colIdx = 0; colIdx < row.cells.length; colIdx++) {
        const cell = row.cells[colIdx];
        const colWidth = columnWidths[colIdx];
        const cellY = this.config.pageHeight - rowStartY;
        // Draw Cell Background
        if (cell.style.backgroundColor) {
          const [r, g, b] = this.parseColor(cell.style.backgroundColor);
          page.drawRectangle({
            x: curColLeftMargin,
            y: cellY - finalRowHeight,
            width: colWidth,
            height: finalRowHeight,
            color: rgb(r, g, b),
          });
        }

        // Draw Cell Borders
        if (table.styles.borders || cell.style.borders) {
          this.drawCellBorders(
            page,
            cell.style.borders ?? table.styles.borders,
            curColLeftMargin,
            cellY + finalRowHeight / 1.5,
            colWidth,
            finalRowHeight
          );
        }
        curColLeftMargin += colWidth;
      }

      // Set Y to the bottom of the completed row for the next row
      this.currentY = rowStartY + finalRowHeight;
    }

    return this;
  }
  private drawCellBorders(
    page: any,
    borders: any,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    const sides = [
      { name: "top", x1: x, y1: y, x2: x + w, y2: y },
      { name: "bottom", x1: x, y1: y - h, x2: x + w, y2: y - h },
      { name: "left", x1: x, y1: y, x2: x, y2: y - h },
      { name: "right", x1: x + w, y1: y, x2: x + w, y2: y - h },
    ];

    for (const side of sides) {
      const border = borders[side.name as keyof typeof borders];
      if (border && border.thickness > 0) {
        const [r, g, b] = this.parseColor(border.color);
        page.drawLine({
          start: { x: side.x1, y: side.y1 },
          end: { x: side.x2, y: side.y2 },
          thickness: border.thickness,
          color: rgb(r, g, b),
        });
      }
    }
  }

  // ==================== IMAGES ====================
  public async addImage(imgEl: ImageElement): Promise<this> {
    if (!this.initialized) {
      throw new Error("PDFBuilder.init() must be called before addImage");
    }

    // Check page break
    this.checkPageBreak(imgEl.height + 10);
    const page = await this.getCurrentPage();

    // Embed image
    let embeddedImage;
    if (imgEl.format === "png") {
      embeddedImage = await this.doc.embedPng(imgEl.data);
    } else if (imgEl.format === "jpeg") {
      embeddedImage = await this.doc.embedJpg(imgEl.data);
    } else {
      throw new Error(`Unsupported image type: ${imgEl.data}`);
    }

    // Center image horizontally if desired, or align to left margin
    const xPos = this.config.marginLeft;
    const yInPDF = this.config.pageHeight - this.currentY - imgEl.height;

    page.drawImage(embeddedImage, {
      x: xPos,
      y: yInPDF,
      width: imgEl.width,
      height: imgEl.height,
    });

    this.currentY += imgEl.height;
    // Add spacing below image
    this.addSpacing(30);
    return this;
  }

  public async build(): Promise<Uint8Array> {
    await this.loadFonts();
    return await this.doc.save();
  }

  public async toBase64(): Promise<string> {
    const pdfBytes = await this.build();
    return btoa(String.fromCharCode(...new Uint8Array(pdfBytes)));
  }
  private doc: PDFDocument;
  private config: Required<PDFConfig>;
  private currentY: number;
  private fonts: Map<string, PDFFont> = new Map();
  private pageIndex: number = 0;
  private initialized = false;
  private fontKitLoaded = false;
  private initializing = false;
  private lastParagraphStyleId = "";
}
