import { simplify as mathsimplify } from 'mathjs';
import { OppositeNode } from '../nodes/functions/oppositeNode';
import { SqrtNode } from '../nodes/functions/sqrtNode';
import { Node } from '../nodes/node';
import { NumberNode } from '../nodes/numbers/numberNode';
import { PiNode } from '../nodes/numbers/piNode';
import { AddNode } from '../nodes/operators/addNode';
import { FractionNode } from '../nodes/operators/fractionNode';
import { MultiplyNode } from '../nodes/operators/multiplyNode';
import { PowerNode } from '../nodes/operators/powerNode';
import { SubstractNode } from '../nodes/operators/substractNode';
import { VariableNode } from '../nodes/variables/variableNode';
import { LogNode } from '../nodes/functions/logNode';
import { ExpNode } from '../nodes/functions/expNode';
import { CosNode } from '#root/tree/nodes/functions/cosNode';
import { SinNode } from '#root/tree/nodes/functions/sinNode';

interface MathjsNode {
  isSymbolNode: boolean;
  isFunctionNode: boolean;
  isConstantNode: boolean;
  isOperatorNode: boolean;
  fn?: MathjsNode | string;
  name?: string;
  value?: any;
  args?: MathjsNode[];
}

export const simplifyNode = (node: Node): Node => {
  return mathjsNodeToNode(mathsimplify(node.toMathString()) as unknown as MathjsNode);
};

const mathjsNodeToNode = (mathjsNode: MathjsNode): Node => {
  if (mathjsNode.isSymbolNode) {
    if (mathjsNode.name === 'pi') return PiNode;
    return new VariableNode(mathjsNode.name!);
  } else if (mathjsNode.isConstantNode) {
    return new NumberNode(mathjsNode.value!);
  } else if (mathjsNode.isOperatorNode) {
    switch (mathjsNode.fn) {
      case 'add':
        return new AddNode(mathjsNodeToNode(mathjsNode.args![0]), mathjsNodeToNode(mathjsNode.args![1]));
      case 'subtract':
        return new SubstractNode(mathjsNodeToNode(mathjsNode.args![0]), mathjsNodeToNode(mathjsNode.args![1]));
      case 'unaryMinus':
        return new OppositeNode(mathjsNodeToNode(mathjsNode.args![0]));
      case 'divide':
        return new FractionNode(mathjsNodeToNode(mathjsNode.args![0]), mathjsNodeToNode(mathjsNode.args![1]));
      case 'multiply':
        return new MultiplyNode(mathjsNodeToNode(mathjsNode.args![0]), mathjsNodeToNode(mathjsNode.args![1]));
      case 'pow':
        return new PowerNode(mathjsNodeToNode(mathjsNode.args![0]), mathjsNodeToNode(mathjsNode.args![1]));
    }
  } else if (mathjsNode.isFunctionNode) {
    const fn = mathjsNode.fn as MathjsNode;
    switch (fn.name) {
      case 'sqrt':
        return new SqrtNode(mathjsNodeToNode(mathjsNode.args![0]));
      case 'log':
        return new LogNode(mathjsNodeToNode(mathjsNode.args![0]));
      case 'exp':
        return new ExpNode(mathjsNodeToNode(mathjsNode.args![0]));
      case 'cos':
        return new CosNode(mathjsNodeToNode(mathjsNode.args![0]));
      case 'sin':
        return new SinNode(mathjsNodeToNode(mathjsNode.args![0]));
    }
  }

  throw Error('unrecognized mathjs node');
};
