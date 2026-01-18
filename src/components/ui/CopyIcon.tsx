import { useState } from "react";

import CopyIcon from "/copy.svg";
import CopyIconSuccess from "/copy-success.svg";

export const Copy = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <img
      src={copied ? CopyIconSuccess : CopyIcon}
      alt={"Copy to Clipboard"}
      title={"Copy to Clipboard"}
      className="justify-end w-8 h-8 cursor-copy"
      onClick={() => {
        if (text) {
          navigator.clipboard.writeText(text);
          setCopied(true);
        }
      }}
    />
  );
};
