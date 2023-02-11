import { coinFlip } from '../../../utils/coinFlip';
import { Node, NodeType } from '../node';

export enum OperatorIds {
  add,
  substract,
  multiply,
  fraction,
  divide,
  power,
  equal,
}

export abstract class OperatorNode {
  id: OperatorIds;
  leftChild: Node;
  rightChild: Node;
  isCommutative: boolean;
  type = NodeType.operator;
  tex: string;
  constructor(id: OperatorIds, leftChild: Node, rightChild: Node, isCommutative: boolean, tex: string) {
    this.id = id;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.isCommutative = isCommutative;
    this.tex = tex;
  }

  /**shuffles in place */
  shuffle(): void {
    if (!this.isCommutative) return;
    if (coinFlip()) return;
    [this.leftChild, this.rightChild] = [this.rightChild, this.leftChild];
    return;
  }
}
