import { Node, NodeOptions, NodeType } from "../node";

type EquationSolutionNodeOptions = { variable?: string; opts?: NodeOptions };
export class EquationSolutionNode implements Node {
  type: NodeType;
  variable: string;
  solutions: Node[];
  opts?: NodeOptions;
  constructor(solutions: Node[], params?: EquationSolutionNodeOptions) {
    this.type = NodeType.set;
    this.solutions = solutions;
    this.variable = params?.variable ?? "x";
    this.opts = params?.opts
      ? {
          ...params.opts,
          allowRawRightChildAsSolution:
            params.opts.allowRawRightChildAsSolution ?? true,
        }
      : { allowRawRightChildAsSolution: true };
  }

  toAllValidTexs() {
    return this.toEquivalentNodes(this.opts).flatMap((el) => el.toAllTexs());
  }

  toAllTexs() {
    const res = [this.toTex()];
    if (this.solutions.length === 1) {
      const solTex = this.solutions[0].toTex();
      res.push(`${this.variable}=${solTex}`);
      if (this.opts?.allowRawRightChildAsSolution) res.push(solTex);
    }
    return res;
  }

  toEquivalentNodes(opts?: NodeOptions) {
    if (this.solutions.length === 1) {
      const equivs = this.solutions.flatMap((sol) =>
        sol.toEquivalentNodes(opts),
      );
      return equivs.map(
        (equiv) =>
          new EquationSolutionNode([equiv], { variable: this.variable, opts }),
      );
    }
    //produit carté
    return [this];
  }

  toMathString() {
    return "";
  }
  toMathjs() {
    return `S={${this.solutions.map((el) => el.toTex()).join(";")}}`;
  }
  toTex() {
    return `S=\\left\\{${this.solutions
      .map((el) => el.toTex())
      .join(";")}\\right\\}`;
  }
}
