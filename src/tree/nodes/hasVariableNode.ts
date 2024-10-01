import { isFunctionNode } from "./functions/functionNode";
import { Node } from "./node";
import { isOperatorNode } from "./operators/operatorNode";
import { isVariableNode } from "./variables/variableNode";

export const hasVariableNode = (n: Node): boolean => {
  if (isVariableNode(n)) return true;
  if (isOperatorNode(n))
    return hasVariableNode(n.leftChild) || hasVariableNode(n.rightChild);
  if (isFunctionNode(n)) return hasVariableNode(n.child);
  return false;
};
