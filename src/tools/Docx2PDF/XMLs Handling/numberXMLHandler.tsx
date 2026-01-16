import type { NumberingLevelInfo } from "../types/types";
export class Numbers {
  constructor(pNumbersXML: string) {
    this._vNumbersDOM = new DOMParser().parseFromString(
      pNumbersXML,
      "application/xml"
    );
    this._vNumMap = this.populateMap();
  }

  populateMap() {
    const map = new Map<number, Map<number, NumberingLevelInfo>>();
    const abstractMap = new Map<number, Map<number, NumberingLevelInfo>>();
    const abstractNums = this._vNumbersDOM.getElementsByTagNameNS(
      this.W_NS,
      "abstractNum"
    );
    for (let i = 0; i < abstractNums.length; i++) {
      const abs = abstractNums[i];
      const absIdAttr =
        abs.getAttributeNS(this.W_NS, "abstractNumId") ||
        abs.getAttribute("w:abstractNumId");
      if (!absIdAttr) continue;
      const absId = parseInt(absIdAttr, 10);
      const lvlMap = new Map<number, NumberingLevelInfo>();

      const lvls = abs.getElementsByTagNameNS(this.W_NS, "lvl");
      for (let j = 0; j < lvls.length; j++) {
        const lvl = lvls[j];
        const ilvlAttr =
          lvl.getAttributeNS(this.W_NS, "ilvl") || lvl.getAttribute("w:ilvl");
        if (!ilvlAttr) continue;
        const ilvl = parseInt(ilvlAttr, 10);

        const numFmtEl = lvl.getElementsByTagNameNS(this.W_NS, "numFmt")[0];
        const lvlTextEl = lvl.getElementsByTagNameNS(this.W_NS, "lvlText")[0];

        const numFmt =
          (numFmtEl &&
            (numFmtEl.getAttributeNS(this.W_NS, "val") ||
              numFmtEl.getAttribute("w:val"))) ||
          "bullet";

        const lvlText =
          (lvlTextEl &&
            (lvlTextEl.getAttributeNS(this.W_NS, "val") ||
              lvlTextEl.getAttribute("w:val"))) ||
          undefined;

        lvlMap.set(ilvl, { numFmt, lvlText });
      }

      abstractMap.set(absId, lvlMap);
    }

    // 2) Resolve numId -> abstractNumId, then copy lvl maps
    const nums = this._vNumbersDOM.getElementsByTagNameNS(this.W_NS, "num");
    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];
      const numIdAttr =
        num.getAttributeNS(this.W_NS, "numId") || num.getAttribute("w:numId");
      if (!numIdAttr) continue;
      const numId = parseInt(numIdAttr, 10);

      const absRef = num.getElementsByTagNameNS(this.W_NS, "abstractNumId")[0];
      if (!absRef) continue;
      const absRefAttr =
        absRef.getAttributeNS(this.W_NS, "val") || absRef.getAttribute("w:val");
      if (!absRefAttr) continue;
      const absId = parseInt(absRefAttr, 10);

      const lvlMap = abstractMap.get(absId);
      if (lvlMap) {
        map.set(numId, lvlMap);
      }
    }

    return map;
  }

  numMap() {
    return this._vNumMap;
  }
  _vNumbersDOM: Document;
  _vNumMap: Map<number, Map<number, NumberingLevelInfo>>;

  W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
}
