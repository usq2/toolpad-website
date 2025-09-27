export function ConvertFileToBase64(file: File | Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result); // This is a data URL: 'data:image/png;base64,...'
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.readAsDataURL(file); // Handles all image file types
  });
}

//read file as array buffer then convert to hex
export function ConvertFileToHex(file: File | Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      const arrayBuffer = reader.result;
      if (!arrayBuffer) {
        reject("Something Went Wrong");
      }
      const bytes = new Uint8Array(arrayBuffer as ArrayBuffer);
      const hex = Array.from(bytes)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      resolve(hex);
      resolve(reader.result); // This is a data URL: 'data:image/png;base64,...'
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.readAsArrayBuffer(file); // Handles all image file types
  });
}
