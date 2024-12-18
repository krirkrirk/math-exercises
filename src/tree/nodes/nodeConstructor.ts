import { Point } from "#root/math/geometry/point";
import { AlgebraicNode } from "./algebraicNode";
import { ComplexNode } from "./complex/complexNode";
import { EqualNode } from "./equations/equalNode";
import { EquationSolutionNode } from "./equations/equationSolutionNode";
import { MultiEqualNode } from "./equations/multiEqualNode";
import { AbsNode } from "./functions/absNode";
import { ArcsinNode } from "./functions/arcSinNode";
import { ArccosNode } from "./functions/arccosNode";
import { ArctanNode } from "./functions/arctanNode";
import { CosNode } from "./functions/cosNode";
import { ExpNode } from "./functions/expNode";
import { IntegralNode } from "./functions/integralNode";
import { Log10Node } from "./functions/log10Node";
import { LogNode } from "./functions/logNode";
import { OppositeNode } from "./functions/oppositeNode";
import { SinNode } from "./functions/sinNode";
import { SqrtNode } from "./functions/sqrtNode";
import { TanNode } from "./functions/tanNode";
import { DegreeNode } from "./geometry/degree";
import { LengthNode } from "./geometry/lengthNode";
import { PointNode } from "./geometry/pointNode";
import { VectorNode } from "./geometry/vectorNode";
import { InequationNode } from "./inequations/inequationNode";
import { InequationSolutionNode } from "./inequations/inequationSolutionNode";
import { Node, NodeIds } from "./node";
import { ConstantNode } from "./numbers/constantNode";
import { NumberNode } from "./numbers/numberNode";
import { PercentNode } from "./numbers/percentNode";
import { AddNode } from "./operators/addNode";
import { BinomialCoefficientNode } from "./operators/binomialCoefficientNode";
import { DivideNode } from "./operators/divideNode";
import { FractionNode } from "./operators/fractionNode";
import { LimitNode } from "./operators/limitNode";
import { MultiplyNode } from "./operators/multiplyNode";
import { PowerNode } from "./operators/powerNode";
import { SubstractNode } from "./operators/substractNode";
import { BelongsNode } from "./sets/belongsNode";
import { DiscreteSetNode } from "./sets/discreteSetNode";
import { IntervalNode } from "./sets/intervalNode";
import { SetNode } from "./sets/setNode";
import { UnionIntervalNode } from "./sets/unionIntervalNode";
import { VariableNode } from "./variables/variableNode";

export const reifyAlgebraic = (identifiers: NodeIdentifiers) =>
  NodeConstructor.fromIdentifiers(identifiers) as AlgebraicNode;
export const reifyNode = (identifiers: NodeIdentifiers) =>
  NodeConstructor.fromIdentifiers(identifiers);
export type NodeIdentifiers = { id: NodeIds } & Record<string, any>;
export abstract class NodeConstructor {
  static fromIdentifiers(identifiers: NodeIdentifiers): Node {
    switch (identifiers.id) {
      case NodeIds.variable: {
        return new VariableNode(identifiers.name);
      }
      case NodeIds.number: {
        return new NumberNode(identifiers.value);
      }
      case NodeIds.constant: {
        return new ConstantNode(
          identifiers.tex,
          identifiers.mathString,
          identifiers.value,
        );
      }
      case NodeIds.complex: {
        return new ComplexNode(
          NodeConstructor.fromIdentifiers(identifiers.re) as AlgebraicNode,
          NodeConstructor.fromIdentifiers(identifiers.im) as AlgebraicNode,
        );
      }
      case NodeIds.percent: {
        return new PercentNode(identifiers.value);
      }

      /**Equations */
      case NodeIds.equal: {
        return new EqualNode(
          NodeConstructor.fromIdentifiers(identifiers.leftChild),
          NodeConstructor.fromIdentifiers(identifiers.rightChild),
        );
      }
      case NodeIds.equationSolution: {
        return new EquationSolutionNode(
          NodeConstructor.fromIdentifiers(
            identifiers.solutionsSet,
          ) as DiscreteSetNode,
        );
      }
      case NodeIds.multiEqual: {
        return new MultiEqualNode(
          identifiers.children.map((e: any) =>
            NodeConstructor.fromIdentifiers(e),
          ),
        );
      }
      /**Inequations */
      case NodeIds.inequation: {
        return new InequationNode(
          identifiers.children.map((e: any) =>
            NodeConstructor.fromIdentifiers(e),
          ),
          identifiers.symbols,
        );
      }
      case NodeIds.inequationSolution: {
        return new InequationSolutionNode(
          NodeConstructor.fromIdentifiers(identifiers.intervalSolution) as
            | IntervalNode
            | UnionIntervalNode,
        );
      }
      /**Geométrie */
      case NodeIds.degree: {
        return new DegreeNode(identifiers.value);
      }
      case NodeIds.point: {
        return new PointNode(
          new Point(
            identifiers.point.name,
            NodeConstructor.fromIdentifiers(
              identifiers.point.x,
            ) as AlgebraicNode,
            NodeConstructor.fromIdentifiers(
              identifiers.point.y,
            ) as AlgebraicNode,
          ),
        );
      }
      case NodeIds.length: {
        return new LengthNode(identifiers.name);
      }
      case NodeIds.vector: {
        return new VectorNode(identifiers.name);
      }

      /**Functions */
      case NodeIds.abs: {
        return new AbsNode(
          NodeConstructor.fromIdentifiers(identifiers.child) as AlgebraicNode,
        );
      }
      case NodeIds.arccos: {
        return new ArccosNode(
          NodeConstructor.fromIdentifiers(identifiers.child) as AlgebraicNode,
        );
      }
      case NodeIds.arcsin: {
        return new ArcsinNode(
          NodeConstructor.fromIdentifiers(identifiers.child) as AlgebraicNode,
        );
      }
      case NodeIds.arctan: {
        return new ArctanNode(
          NodeConstructor.fromIdentifiers(identifiers.child) as AlgebraicNode,
        );
      }
      case NodeIds.cos: {
        return new CosNode(
          NodeConstructor.fromIdentifiers(identifiers.child) as AlgebraicNode,
        );
      }
      case NodeIds.sin: {
        return new SinNode(
          NodeConstructor.fromIdentifiers(identifiers.child) as AlgebraicNode,
        );
      }
      case NodeIds.tan: {
        return new TanNode(
          NodeConstructor.fromIdentifiers(identifiers.child) as AlgebraicNode,
        );
      }
      case NodeIds.exp: {
        return new ExpNode(
          NodeConstructor.fromIdentifiers(identifiers.child) as AlgebraicNode,
        );
      }
      case NodeIds.integral: {
        return new IntegralNode(
          NodeConstructor.fromIdentifiers(
            identifiers.functionNode,
          ) as AlgebraicNode,
          NodeConstructor.fromIdentifiers(
            identifiers.lowerBound,
          ) as AlgebraicNode,
          NodeConstructor.fromIdentifiers(
            identifiers.upperBound,
          ) as AlgebraicNode,
          identifiers.variable,
        );
      }
      case NodeIds.log10: {
        return new Log10Node(
          NodeConstructor.fromIdentifiers(identifiers.child) as AlgebraicNode,
        );
      }
      case NodeIds.log: {
        return new LogNode(
          NodeConstructor.fromIdentifiers(identifiers.child) as AlgebraicNode,
        );
      }
      case NodeIds.opposite: {
        return new OppositeNode(
          NodeConstructor.fromIdentifiers(identifiers.child) as AlgebraicNode,
        );
      }
      case NodeIds.sqrt: {
        return new SqrtNode(
          NodeConstructor.fromIdentifiers(identifiers.child) as AlgebraicNode,
        );
      }
      /**Sets */
      case NodeIds.discreteSet: {
        return new DiscreteSetNode(
          identifiers.children.map((e: any) =>
            NodeConstructor.fromIdentifiers(e),
          ),
        );
      }
      case NodeIds.belongs: {
        return new BelongsNode(
          NodeConstructor.fromIdentifiers(identifiers.leftChild),
          NodeConstructor.fromIdentifiers(identifiers.rightChild) as SetNode,
        );
      }
      case NodeIds.interval: {
        return new IntervalNode(
          NodeConstructor.fromIdentifiers(
            identifiers.leftChild,
          ) as AlgebraicNode,
          NodeConstructor.fromIdentifiers(
            identifiers.rightChild,
          ) as AlgebraicNode,
          identifiers.closure,
        );
      }
      case NodeIds.union: {
        return new UnionIntervalNode(
          identifiers.children.map((e: any) =>
            NodeConstructor.fromIdentifiers(e),
          ),
        );
      }

      /**Operators */
      case NodeIds.add: {
        return new AddNode(
          NodeConstructor.fromIdentifiers(
            identifiers.leftChild,
          ) as AlgebraicNode,
          NodeConstructor.fromIdentifiers(
            identifiers.rightChild,
          ) as AlgebraicNode,
        );
      }
      case NodeIds.substract: {
        return new SubstractNode(
          NodeConstructor.fromIdentifiers(
            identifiers.leftChild,
          ) as AlgebraicNode,
          NodeConstructor.fromIdentifiers(
            identifiers.rightChild,
          ) as AlgebraicNode,
        );
      }
      case NodeIds.multiply: {
        return new MultiplyNode(
          NodeConstructor.fromIdentifiers(
            identifiers.leftChild,
          ) as AlgebraicNode,
          NodeConstructor.fromIdentifiers(
            identifiers.rightChild,
          ) as AlgebraicNode,
        );
      }
      case NodeIds.divide: {
        return new DivideNode(
          NodeConstructor.fromIdentifiers(
            identifiers.leftChild,
          ) as AlgebraicNode,
          NodeConstructor.fromIdentifiers(
            identifiers.rightChild,
          ) as AlgebraicNode,
        );
      }
      case NodeIds.fraction: {
        return new FractionNode(
          NodeConstructor.fromIdentifiers(
            identifiers.leftChild,
          ) as AlgebraicNode,
          NodeConstructor.fromIdentifiers(
            identifiers.rightChild,
          ) as AlgebraicNode,
        );
      }
      case NodeIds.power: {
        return new PowerNode(
          NodeConstructor.fromIdentifiers(
            identifiers.leftChild,
          ) as AlgebraicNode,
          NodeConstructor.fromIdentifiers(
            identifiers.rightChild,
          ) as AlgebraicNode,
        );
      }
      case NodeIds.limit: {
        return new LimitNode(
          NodeConstructor.fromIdentifiers(
            identifiers.leftChild,
          ) as AlgebraicNode,
          NodeConstructor.fromIdentifiers(
            identifiers.rightChild,
          ) as AlgebraicNode,
          identifiers.from,
        );
      }
      case NodeIds.binomialCoefficient: {
        return new BinomialCoefficientNode(
          NodeConstructor.fromIdentifiers(
            identifiers.leftChild,
          ) as AlgebraicNode,
          NodeConstructor.fromIdentifiers(
            identifiers.rightChild,
          ) as AlgebraicNode,
        );
      }
    }
  }
}
