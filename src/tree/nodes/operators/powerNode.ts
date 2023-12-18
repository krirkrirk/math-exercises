import { pow } from "mathjs";
import { Node, NodeOptions, NodeType } from "../node";
import { OperatorIds, OperatorNode } from "./operatorNode";
import { NumberNode } from "../numbers/numberNode";
import { MultiplyNode } from "./multiplyNode";

export class PowerNode implements OperatorNode {
  opts?: NodeOptions;
  id: OperatorIds;
  leftChild: Node;
  rightChild: Node;
  type: NodeType;
  constructor(leftChild: Node, rightChild: Node, opts?: NodeOptions) {
    this.id = OperatorIds.power;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.type = NodeType.operator;
    this.opts = opts;
  }

  toMathString(): string {
    return `(${this.leftChild.toMathString()})^(${this.rightChild.toMathString()})`;
  }

  toEquivalentNodes() {
    const res: Node[] = [];
    const rightNodes = this.rightChild.toEquivalentNodes();
    const leftNodes = this.leftChild.toEquivalentNodes();
    rightNodes.forEach((rightNode) => {
      leftNodes.forEach((leftNode) => {
        res.push(new PowerNode(leftNode, rightNode));
        if (
          this.opts?.allowPowerToProduct &&
          this.rightChild.type === NodeType.number
        ) {
          const power = (this.rightChild as NumberNode).value;
          if (Math.floor(power) !== power || power < 2) return;
          let tree = new MultiplyNode(leftNode, leftNode);
          for (let i = 2; i < power; i++) {
            tree = new MultiplyNode(tree, leftNode);
          }
          res.push(tree);
        }
      });
    });
    return res;
  }

  toAllValidTexs(): string[] {
    return this.toEquivalentNodes().map((node) => node.toTex());
  }

  toTex(): string {
    let rightTex = this.rightChild.toTex();
    let leftTex = this.leftChild.toTex();
    let needBrackets = leftTex[0] === "-";
    if (this.leftChild.type === NodeType.operator) {
      const childOperator = this.leftChild as OperatorNode;
      needBrackets ||= [
        OperatorIds.add,
        OperatorIds.substract,
        OperatorIds.multiply,
        OperatorIds.divide,
        OperatorIds.fraction,
        OperatorIds.power,
      ].includes(childOperator.id);
    }
    if (needBrackets) leftTex = `\\left(${leftTex}\\right)`;
    const needBrace = rightTex.length > 1;
    if (needBrace) return `${leftTex}^{${rightTex}}`;
    else return `${leftTex}^${rightTex}`;
  }

  toMathjs() {
    return pow(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  }
}

export class SquareNode extends PowerNode {
  constructor(child: Node, opts?: NodeOptions) {
    super(child, new NumberNode(2), opts);
  }
}
