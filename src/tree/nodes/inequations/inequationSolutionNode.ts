import { Node, NodeIds, NodeOptions, NodeType } from "../node";
import { IntervalNode, isIntervalNode } from "../sets/intervalNode";
import { UnionIntervalNode } from "../sets/unionIntervalNode";

type InequationSolutionNodeOptions = { variable?: string; opts?: NodeOptions };
export class InequationSolutionNode implements Node {
  type: NodeType;
  variable: string;
  intervalSolution: IntervalNode | UnionIntervalNode;
  opts?: NodeOptions;
  constructor(
    intervalSolution: IntervalNode | UnionIntervalNode,
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
  toIdentifiers() {
    return {
      id: NodeIds.inequationSolution,
      intervalSolution: this.intervalSolution.toIdentifiers(),
    };
  }
  toAllTexs() {
    const intervalTex = this.intervalSolution.toTex();
    const res = [
      this.toTex(),
      intervalTex,
      `${this.variable}\\in${intervalTex}`,
    ];
    return res;
  }

  toAllValidTexs() {
    return this.toEquivalentNodes(this.opts).flatMap((el) => el.toAllTexs());
  }

  toEquivalentNodes(opts?: NodeOptions) {
    if (isIntervalNode(this.intervalSolution)) {
      const equivs = this.intervalSolution.toEquivalentNodes(opts ?? this.opts);
      return equivs.flatMap((equiv) => [
        new InequationSolutionNode(equiv, { variable: this.variable, opts }),
        ...equiv.toInequality().toEquivalentNodes(),
      ]);
    } else {
      const equivs = this.intervalSolution.toEquivalentNodes(opts ?? this.opts);
      return equivs.flatMap((equiv) => [
        new InequationSolutionNode(equiv, { variable: this.variable, opts }),
      ]);
    }
  }

  toMathString() {
    return "";
  }
  toMathjs() {
    return `S={${this.intervalSolution.toMathjs()}}`;
  }
  toTex() {
    return `S=\\ ${this.intervalSolution.toTex()}`;
  }
}
