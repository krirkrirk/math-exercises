import { Node, NodeType } from "../nodes/node";
import { OperatorNode } from "../nodes/operators/operatorNode";

export function latexParse(node: Node | null): string {
  if (!node) {
    console.log("parsing a null node ???");
    return "";
  }
  switch (node.type) {
    case NodeType.variable:
      return node.tex;
    case NodeType.number:
      return node.tex;
    case NodeType.operator:
      let rightTex = latexParse(node.rightChild);
      let leftTex = latexParse(node.leftChild);
      const { leftChild, rightChild } = node;
      switch (node.id) {
        case "add":
          return `${leftTex} ${rightTex[0] === "-" ? "" : "+ "}${rightTex}`;

        case "opposite":
          const needBrackets = leftChild!.id === "add" || leftChild!.id === "substract" || leftTex[0] === "-";
          if (needBrackets) leftTex = `(${leftTex})`;
          return `-${leftTex}`;

        case "substract": {
          const needBrackets = rightChild!.id === "add" || rightChild!.id === "substract" || rightTex[0] === "-";
          if (needBrackets) rightTex = `(${rightTex})`;
          return `${leftTex} - ${rightTex}`;
        }

        case "multiply": {
          if (leftChild!.id === "add" || leftChild!.id === "substract") leftTex = `(${leftTex})`;
          const needBrackets = rightChild!.id === "add" || rightChild!.id === "substract" || rightTex[0] === "-";
          if (needBrackets) rightTex = `(${rightTex})`;
          // !isNaN(+rightTex[0])  permet de gérer le cas 3*2^x
          const showTimesSign = !isNaN(+rightTex[0]) || rightChild!.id === "divide";
          return `${leftTex}${showTimesSign ? "\\times " : ""}${rightTex}`;
        }

        case "divide": {
          return `\\frac{${leftTex}}{${rightTex}}`;
        }

        case "power": {
          if (leftChild!.id === "add" || leftChild!.id === "substract" || leftChild!.id === "multiply")
            leftTex = `(${leftTex})`;
          return `${leftTex}^{${rightTex}}`;
        }

        case "equal": {
          return `${leftTex} = ${rightTex}`;
        }
        default:
          return node.tex;
      }
    case NodeType.function: {
      let leftTex = latexParse(node.leftChild);
      switch (node.id) {
        case "sqrt": {
          return `\\sqrt{${leftTex}}`;
        }
      }
    }
    default:
      return "";
  }
}
