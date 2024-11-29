import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { NodeIdentifiers } from "#root/tree/nodes/nodeConstructor";
import { combinations } from "../utils/combinatorics/combination";
import { sum } from "../utils/sum";

export class Binomial {
  n: number;
  p: AlgebraicNode;
  constructor(n: number, p: AlgebraicNode) {
    this.n = n;
    this.p = p;
  }

  sup(k: number) {
    const proba = this.p.evaluate();
    return sum(
      k,
      this.n,
      (i) =>
        combinations(i, this.n) *
        Math.pow(proba, i) *
        Math.pow(1 - proba, this.n - i),
    );
  }
  inf(k: number) {
    const proba = this.p.evaluate();
    return sum(
      0,
      k,
      (i) =>
        combinations(i, this.n) *
        Math.pow(proba, i) *
        Math.pow(1 - proba, this.n - i),
    );
  }
  ineq(a: number, b: number) {
    const proba = this.p.evaluate();
    return sum(
      a,
      b,
      (i) =>
        combinations(i, this.n) *
        Math.pow(proba, i) *
        Math.pow(1 - proba, this.n - i),
    );
  }
}
