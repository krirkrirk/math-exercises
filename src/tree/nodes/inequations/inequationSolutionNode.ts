import { Node, NodeOptions, NodeType } from "../node";
import { IntervalNode } from "../sets/intervalNode";

type InequationSolutionNodeOptions = { variable?: string; opts?: NodeOptions };
export class InequationSolutionNode implements Node {
  type: NodeType;
  variable: string;
  intervalSolution: IntervalNode;
  opts?: NodeOptions;
  constructor(
    intervalSolution: IntervalNode,
    params?: InequationSolutionNodeOptions,
  ) {
    this.type = NodeType.set;
    this.intervalSolution = intervalSolution;
    this.variable = params?.variable ?? "x";
    this.opts = params?.opts
      ? {
          ...params.opts,
          allowRawRightChildAsSolution:
            params.opts.allowRawRightChildAsSolution ?? true,
        }
      : { allowRawRightChildAsSolution: true };
  }

  toAllTexs() {
    const intervalTex = this.intervalSolution.toTex();
    const res = [
      this.toTex(),
      this.intervalSolution.toTex(),
      `${this.variable}\\in${intervalTex}`,
    ];
    return res;
  }

  toAllValidTexs() {
    return this.toEquivalentNodes(this.opts).flatMap((el) => el.toAllTexs());
  }

  toEquivalentNodes(opts?: NodeOptions) {
    const equivs = this.intervalSolution.toEquivalentNodes(opts ?? this.opts);
    return equivs.flatMap((equiv) => [
      new InequationSolutionNode(equiv, { variable: this.variable, opts }),
      ...equiv.toInequality().toEquivalentNodes(),
    ]);
  }

  toMathString() {
    return "";
  }
  toMathjs() {
    return `S={${this.intervalSolution.toMathjs()}}`;
  }
  toTex() {
    return `S=${this.intervalSolution.toTex()}`;
  }
}
