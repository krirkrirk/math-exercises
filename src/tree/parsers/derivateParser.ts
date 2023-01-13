import { Node, NodeType } from "../nodes/node";
import { NumberNode } from "../nodes/numbers/numberNode";
import { PowerNode } from "../nodes/operators/powerNode";

import { AddNode } from "../nodes/operators/addNode";
import { FractionNode } from "../nodes/operators/fractionNode";
import { MultiplyNode } from "../nodes/operators/multiplyNode";
import { OperatorIds, OperatorNode } from "../nodes/operators/operatorNode";
import { SubstractNode } from "../nodes/operators/substractNode";
import { FunctionNode, FunctionsIds } from "../nodes/functions/functionNode";
import { SqrtNode } from "../nodes/functions/sqrtNode";
import { OppositeNode } from "../nodes/functions/oppositeNode";

export function derivateParser(node: Node): Node {
  if (!node) throw Error("encountered a null node ??");

  switch (node.type) {
    case NodeType.variable:
      return new NumberNode(1);
    case NodeType.number:
      return new NumberNode(0);
    case NodeType.operator:
      const operatorNode = node as OperatorNode;
      const u = operatorNode.leftChild;
      const v = operatorNode.rightChild;
      switch (operatorNode.id) {
        case OperatorIds.add:
          return new AddNode(derivateParser(u), derivateParser(v));
        case OperatorIds.substract: {
          return new SubstractNode(derivateParser(u), derivateParser(v));
        }
        case OperatorIds.multiply: {
          return new AddNode(new MultiplyNode(derivateParser(u), v), new MultiplyNode(u, derivateParser(v)));
        }
        case OperatorIds.divide:
        case OperatorIds.fraction:
          return new FractionNode(
            new SubstractNode(new MultiplyNode(derivateParser(u), v), new MultiplyNode(u, derivateParser(v))),
            new PowerNode(v, new NumberNode(2))
          );

        case OperatorIds.power: {
          const operatorNode = node as OperatorNode;
          const n = operatorNode.rightChild as NumberNode;
          const u = operatorNode.leftChild;
          return new MultiplyNode(
            n,
            new MultiplyNode(derivateParser(u), new PowerNode(u, new NumberNode(n.value - 1)))
          );
        }
      }
    case NodeType.function: {
      const functionNode = node as FunctionNode;
      const child = functionNode.child;
      switch (functionNode.id) {
        case FunctionsIds.sqrt: {
          return new FractionNode(derivateParser(child), new MultiplyNode(new NumberNode(2), new SqrtNode(child)));
        }

        case FunctionsIds.opposite: {
          return new OppositeNode(derivateParser(child));
        }
      }
    }
  }
}
