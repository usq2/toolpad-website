export const Base64ToHex = (pBase64: string) => {
  if (!pBase64) {
    return "";
  }
  const binary = atob(pBase64); // decode base64 to binary string
  let hex = "";
  for (let i = 0; i < binary.length; ++i) {
    hex += binary.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return hex;
};

export const HexToBase64 = (pHex: string) => {
  if (!pHex) return "";
  const bytes = pHex.match(/.{1,2}/g)!.map((x) => parseInt(x, 16));
  const binary = String.fromCharCode(...bytes);
  return btoa(binary);
};

export const StringToBase64 = (pStr: string) => {
  const uint8Array = new TextEncoder().encode(pStr);
  let binary = "";
  uint8Array.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

export const StringToHex = (pStr: string) => {
  let hex = "";
  for (let i = 0; i < pStr.length; i++) {
    hex += pStr.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return hex;
};

export const Base64ToString = (pBase64: string) => {
  if (!pBase64) {
    return "";
  }
  // Decode from base64 to binary string
  const binaryString = atob(pBase64);

  // Convert binary string to UTF-8 string (handles Unicode correctly)
  const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
  const decodedString = new TextDecoder().decode(bytes);

  return decodedString;
};
export const HexToString = (pHex: string) => {
  if (!pHex) {
    return "";
  }
  let str = "";
  for (let i = 0; i < pHex.length; i += 2) {
    const code = parseInt(pHex.substr(i, 2), 16);
    str += String.fromCharCode(code);
  }
  return str;
};
