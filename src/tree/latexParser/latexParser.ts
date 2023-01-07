import { Node, NodeType } from "../nodes/node";
import { OperatorNode } from "../nodes/operators/operatorNode";

export class LatexParser {
  parse(node: Node | null): string {
    if (node === null) return "";
    switch (node.type) {
      case NodeType.variable:
        return node.tex;
      case NodeType.number:
        return node.tex;
      case NodeType.operator:
        switch (node.id) {
          case "add":
            const rightTex = this.parse(node.rightChild);
            return `${this.parse(node.leftChild)} ${rightTex[0] === "-" ? "" : "+"} ${rightTex}`;
          case "multiply":
            /**
             * si opération + ou - alors mettre parenthèses
             * sinon pas besoin sauf si nb négatif
             *
             */
            return node.tex;
          default:
            return node.tex;
        }
        break;
      default:
        break;
    }
    return "";
  }
}
