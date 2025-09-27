const serialize = (node: HTMLElement | ChildNode, level = 0) => {
  let indent = "  ".repeat(level);
  let result = "";

  if (node.nodeType === 3) {
    // Text node
    const text = node.nodeValue?.trim();
    if (text) {
      result += indent + text + "\n";
    }
  } else if (node.nodeType === 1) {
    // Element node
    result += indent + "<" + node.nodeName;
    // Attributes
    for (let attr of (node as HTMLElement).attributes) {
      result += ` ${attr.name}="${attr.value}"`;
    }
    if (node.childNodes.length === 0) {
      result += " />\n";
    } else {
      result += ">\n";
      // Children
      for (let child of node.childNodes) {
        result += serialize(child, level + 1);
      }
      result += indent + `</${node.nodeName}>\n`;
    }
  }
  return result;
};

export const FormatXml = (xml: string) => {
  const domParser = new DOMParser();
  const xmlDoc = domParser.parseFromString(xml, "application/xml");
  return serialize(xmlDoc.documentElement).trim();
};
