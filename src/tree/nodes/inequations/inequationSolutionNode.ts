import { Node, NodeOptions, NodeType } from "../node";
import { DiscreteSetNode } from "../sets/discreteSetNode";
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

  toAllValidTexs() {
    return this.toEquivalentNodes(this.opts).map((el) => el.toTex());
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
