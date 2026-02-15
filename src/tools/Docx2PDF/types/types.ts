// Extend BasicStyle with more paragraph + run features you can actually use
export interface BasicStyle {
  // run-level
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italics: boolean;
  color: string;
  underline: string;
  strike: boolean;
  allCaps?: boolean;
  smallCaps?: boolean;
  vertAlign?: "baseline" | "superscript" | "subscript";

  // paragraph-level
  align?: "left" | "center" | "right" | "justify";
  marginLeft?: number;
  marginRight?: number;
  firstLineIndent?: number; // +ve = first line, -ve = hanging, in pt
  spaceBefore?: number;
  spaceAfter?: number;
  lineSpacing?: number; // in pt; combine with lineSpacingRule
  lineSpacingRule?: "auto" | "exact" | "atLeast";
  contextualSpacing?: boolean;
  outlineLevel?: number | null;
  shadingColor?: string | null; // paragraph background

  borderTop?: { color: string; thickness: number; space: number } | null;
  borderBottom?: { color: string; thickness: number; space: number } | null;

  styleId: string;
}

export type ThemeFonts = {
  majorFont: string;
  // majorEastAsia: string;
  // majorBidi: string;
  minorFont: string;
  // minorEastAsia: string;
  // minorBidi: string;
};

export type ThemeColors = {
  [key: string]: string;
};

export interface StylesMap {
  [k: string]: BasicStyle | TableStyle;
}

export interface TextElement extends BasicStyle {
  text: string;
}

export interface PDFConfig {
  pageWidth?: number;
  pageHeight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  lineHeight?: number;
}
export type JSONStruct = {
  document: {
    meta: {
      title: string;
      author: string;
      creationDate: Date;
    };
    theme: {
      fonts: ThemeFonts;
      colors: ThemeColors;
    };
    sections: Content[];
  };
};

export interface ListElement extends BasicStyle {
  type: ElementTypes.LIST;
  text: string;
  listType: "bullet" | "number";
  level: number;
  numId: number;
}

export interface ImageElement {
  data: ArrayBuffer | Uint8Array; // Image buffer
  width: number; // Width in points
  height: number; // Height in points
  format: "png" | "jpeg"; // Image type
}

export enum ElementTypes {
  PARAGRAPH = "paragraph",
  IMAGE = "image",
  LIST = "list",
  TABLE = "TABLE",
}

export type Content = Paragraph | ListElement | Image | TableElement;

export interface Paragraph extends TextElement {
  type: ElementTypes.PARAGRAPH;
  alignment: string;
}

export interface Image extends ImageElement {
  type: ElementTypes.IMAGE;
}

export interface NumberingLevelInfo {
  numFmt: string; // e.g. "bullet", "decimal"
  lvlText?: string; // e.g. "•" or "%1."
}

export type NumberingMap = Map<number, Map<number, NumberingLevelInfo>>;

export interface TableRowStyle {
  height?: number;
  cannotSplit?: boolean; // w:cantSplit
}

export interface TableStyle {
  width?: number;
  borders?: {
    top?: { color: string; thickness: number };
    right?: { color: string; thickness: number };
    bottom?: { color: string; thickness: number };
    left?: { color: string; thickness: number };
  };
  margins: { top: number; right: number; bottom: number; left: number };
  indent?: number;
  cellSpacing?: number; // w:tblCellSpacing
}

export interface TableCell {
  content: TextElement[]; // array of paragraphs/text
  style: TableCellStyle;
}

export interface TableRow {
  cells: TableCell[];
  style: TableRowStyle;
}

export interface TableElement {
  type: ElementTypes.TABLE;
  rows: TableRow[];
  styles: TableStyle;
  gridColumns: number[]; // column widths in points
}
export interface TableStyleInfo {
  styleId: string; // w:style/@w:styleId

  // Default properties (always applied)
  tblPr?: {
    tableStyleId?: string; // w:tblStyle/@w:val
    justification?: "left" | "center" | "right";
    tableAlign?: "left" | "center" | "right";
    cellSpacing?: number; // w:tblCellSpacing/@w:w
    indentation?: number; // w:tblInd/@w:w
    borders?: Record<
      "top" | "left" | "bottom" | "right" | "insideH" | "insideV",
      TableBorder
    >;
  };

  trPr?: TableRowStyle; // Default row properties
  tcPr?: TableCellStyle; // Default cell properties

  // Conditional formatting tblStylePr[type]
  tblStylePr?: Partial<
    Record<
      TblStyleOverrideType,
      {
        tblPr?: TableStyleInfo["tblPr"];
        trPr?: TableRowStyle;
        tcPr?: TableCellStyle;
      }
    >
  >;
}

export type TableBordersObj = {
  top: {
    style: string;
    thickness: number;
    color: string;
  };
  bottom: {
    style: string;
    thickness: number;
    color: string;
  };
  left: {
    style: string;
    thickness: number;
    color: string;
  };
  right: {
    style: string;
    thickness: number;
    color: string;
  };
  insideH: {
    style: string;
    thickness: number;
    color: string;
  };
  insideV: {
    style: string;
    thickness: number;
    color: string;
  };
};
// OOXML conditional formatting types (ST_TblStyleOverrideType)
type TblStyleOverrideType =
  | "wholeTable" // tblPr for entire table
  | "firstRow" // Header row
  | "lastRow" // Footer row
  | "firstColumn" // First column
  | "lastColumn" // Last column
  | "band1Vert" // Odd banded columns
  | "band2Vert" // Even banded columns
  | "band1Horz" // Odd banded rows (band1Row)
  | "band2Horz" // Even banded rows (band2Row)
  | "neCell" // Top-left corner
  | "nwCell" // Top-right corner
  | "seCell" // Bottom-left corner
  | "swCell"; // Bottom-right corner

export interface TableBorder {
  color?: string; // w:val/@w:color
  thickness: number; // w:val/@w:sz (8ths of pt)
  space?: number; // w:val/@w:space
}

export interface TableMargin {
  top?: number; // w:top/@w:w (twips)
  right?: number;
  bottom?: number;
  left?: number;
}

export interface TableCellStyle {
  width?: number;
  vAlign?: "top" | "center" | "bottom";
  gridSpan?: number; // w:gridSpan/@w:val
  hMerge?: "continue" | "restart";
  vMerge?: "continue" | "restart";
  margins?: TableMargin;
  borders?: Partial<Record<"top" | "right" | "bottom" | "left", TableBorder>>;
  backgroundColor?: string; // w:shd/@w:fill
  textDirection?: string;
  noWrap?: boolean;
}
