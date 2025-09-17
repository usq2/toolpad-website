import { createBrowserRouter, RouteObject } from "react-router-dom";
import { HomePage } from "../src/pages/HomePage";
import DocxToPdf from "../src/pages/DocxToPdf";
import { StringConvert } from "../src/pages/StringConvert";
import { EncodeDecodeHomePage } from "../src/pages/DevTools/EncodeDecode/HomePage";
import { StringBase64 } from "../src/pages/DevTools/EncodeDecode/StringToBase64";
import { StringHex } from "../src/pages/DevTools/EncodeDecode/StringToHex";
import { FileBase64 } from "../src/pages/DevTools/EncodeDecode/FileToBase64";
import { FileHex } from "../src/pages/DevTools/EncodeDecode/FileToHex";
import { Base64Hex } from "../src/pages/DevTools/EncodeDecode/Base64ToHex";
import { HexBase64 } from "../src/pages/DevTools/EncodeDecode/HexToBase64";
import { Base64String } from "../src/pages/DevTools/EncodeDecode/Base64ToString";
import { HexString } from "../src/pages/DevTools/EncodeDecode/HexToString";
// const HomePage = await import("../src/pages/DocxToPdf")
// const HomePage = lazy(() => import ("../src/pages/DocxToPdf"))
// const HomePage = lazy(() => import ("../src/pages/DocxToPdf"))
// const HomePage = lazy(() => import ("../src/pages/DocxToPdf"))

const routes: RouteObject[] = [
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/docx-to-pdf",
    Component: DocxToPdf,
  },
  {
    path: "/encode-decode",
    Component: EncodeDecodeHomePage,
    children: [
      {
        path: "string-to-base64",
        Component: StringBase64,
        index: true,
      },
      {
        path: "string-to-hex",
        Component: StringHex,
      },
      {
        path: "file-to-base64",
        Component: FileBase64,
      },
      {
        path: "file-to-hex",
        Component: FileHex,
      },
      {
        path: "base64-to-hex",
        Component: Base64Hex,
      },
      {
        path: "hex-to-base64",
        Component: HexBase64,
      },
      {
        path: "base64-to-string",
        Component: Base64String,
      },
      {
        path: "hex-to-string",
        Component: HexString,
      },
    ],
  },
];
export const AppRoutes = createBrowserRouter(routes, {
  basename: "/toolpad-website",
});
