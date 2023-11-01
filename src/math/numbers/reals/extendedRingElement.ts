import { OppositeNode } from '#root/tree/nodes/functions/oppositeNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { SubstractNode } from '#root/tree/nodes/operators/substractNode';
import { Nombre } from '../nombre';

/**
 * element of Q(x)
 * exp 2+3sqrt(5)
 */
export class ExtendedRingElement {
  //elementType

  //add another element of ring

  //divide by number
  a: number;
  b: number;
  algebraicElement: Nombre;
  constructor(a: number, b: number, algebraicElement: Nombre) {
    this.a = a;
    this.b = b;
    this.algebraicElement = algebraicElement;
  }

  toTree() {
    if (this.b === 0) {
      return new NumberNode(this.a);
    } else {
      if (this.a === 0) {
        if (this.b === 1) return this.algebraicElement.toTree();
        if (this.b === -1) return new OppositeNode(this.algebraicElement.toTree());
        return new MultiplyNode(new NumberNode(this.b), this.algebraicElement.toTree());
      } else {
        if (this.b === 1) return new AddNode(new NumberNode(this.a), this.algebraicElement.toTree());
        if (this.b === -1) return new SubstractNode(new NumberNode(this.a), this.algebraicElement.toTree());
        return new AddNode(new NumberNode(this.a), this.algebraicElement.toTree());
      }
    }
  }
}
