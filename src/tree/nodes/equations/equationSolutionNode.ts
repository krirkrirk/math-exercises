import { Node, NodeIds, NodeOptions, NodeType } from "../node";
import { DiscreteSetNode } from "../sets/discreteSetNode";

type EquationSolutionNodeOptions = { variable?: string; opts?: NodeOptions };
export class EquationSolutionNode implements Node {
  type: NodeType;
  variable: string;
  solutionsSet: DiscreteSetNode;
  opts?: NodeOptions;
  constructor(
    solutionsSet: DiscreteSetNode,
    params?: EquationSolutionNodeOptions,
  ) {
    this.type = NodeType.set;
    this.solutionsSet = solutionsSet;
    this.variable = params?.variable ?? "x";
    this.opts = params?.opts
      ? {
          ...params.opts,
          allowRawRightChildAsSolution:
            params.opts.allowRawRightChildAsSolution ?? true,
        }
      : { allowRawRightChildAsSolution: true };
  }

  toIdentifiers() {
    return {
      id: NodeIds.equationSolution,
      solutionsSet: this.solutionsSet.toIdentifiers(),
    };
  }
  toAllValidTexs() {
    return this.toEquivalentNodes(this.opts).flatMap((el) => el.toAllTexs());
  }

  toAllTexs() {
    const res = [this.toTex(), this.solutionsSet.toTex()];
    if (this.solutionsSet.elements.length === 1) {
      const solTex = this.solutionsSet.elements[0].toTex();
      res.push(`${this.variable}=${solTex}`);
      if (this.opts?.allowRawRightChildAsSolution) res.push(solTex);
    } else {
      const solTex = this.solutionsSet.elements.map((e) => e.toTex());
      res.push(solTex.map((e) => `${this.variable}=${e}`).join("\\text{ ou }"));
      res.push(solTex.map((e) => `${this.variable}=${e}`).join(";"));
      if (this.opts?.allowRawRightChildAsSolution) {
        res.push(solTex.join(";"));
        res.push(solTex.join("\\text{ ou }"));
      }
    }
    return res;
  }

  toEquivalentNodes(opts?: NodeOptions) {
    const equivs = this.solutionsSet.toEquivalentNodes(opts ?? this.opts);
    return equivs.map(
      (equiv) =>
        new EquationSolutionNode(equiv, { variable: this.variable, opts }),
    );
  }

  toMathString() {
    return "";
  }
  toMathjs() {
    return `S={${this.solutionsSet.toMathjs()}}`;
  }
  toTex() {
    return `S=${this.solutionsSet.toTex()}`;
  }
}
