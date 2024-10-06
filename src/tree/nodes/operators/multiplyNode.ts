// import { multiply } from "mathjs";
import { Node, NodeIds, NodeOptions, NodeType, ToTexOptions } from "../node";
import {
  CommutativeOperatorNode,
  OperatorIds,
  isOperatorNode,
} from "./operatorNode";
import { coinFlip } from "#root/utils/coinFlip";
import { permute } from "#root/utils/permutations";
import {
  getCartesiansProducts,
  getFlatCartesianProducts,
} from "#root/utils/cartesianProducts";
import { operatorComposition } from "#root/tree/utilities/operatorComposition";
import { PowerNode, SquareNode, isPowerNode } from "./powerNode";
import { NumberNode, isNumberNode } from "../numbers/numberNode";
import { isInt } from "#root/utils/isInt";
import { isVariableNode } from "../variables/variableNode";
import { AlgebraicNode, SimplifyOptions } from "../algebraicNode";
import { SqrtNode, isSqrtNode } from "../functions/sqrtNode";
import { OppositeNode, isOppositeNode } from "../functions/oppositeNode";
import { FractionNode, isFractionNode } from "./fractionNode";
import { isFunctionNode } from "../functions/functionNode";
import { AddNode } from "./addNode";
import { round } from "#root/math/utils/round";
import { colorize } from "#root/utils/latex/colorize";
export function isMultiplyNode(a: Node): a is MultiplyNode {
  return isOperatorNode(a) && a.id === OperatorIds.multiply;
}

export const sortMultiplyNodes = (arr: AlgebraicNode[]) => {
  arr.sort((a, b) => {
    return (
      Number(b.isNumeric) - Number(a.isNumeric) ||
      Number(isNumberNode(b) && b.value === -1) -
        Number(isNumberNode(a) && a.value === -1) ||
      Number(isNumberNode(b)) - Number(isNumberNode(a)) ||
      Number(isFunctionNode(b)) - Number(isFunctionNode(a)) ||
      Number(isOperatorNode(b)) - Number(isOperatorNode(a))
    );
  });
};
export class MultiplyNode implements CommutativeOperatorNode {
  opts?: NodeOptions;
  id: OperatorIds;
  leftChild: AlgebraicNode;
  rightChild: AlgebraicNode;
  type: NodeType;
  isNumeric: boolean;
  constructor(
    leftChild: AlgebraicNode,
    rightChild: AlgebraicNode,
    opts?: NodeOptions,
  ) {
    this.id = OperatorIds.multiply;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.type = NodeType.operator;
    this.opts = opts;
    this.isNumeric = leftChild.isNumeric && rightChild.isNumeric;
  }

  shuffle = () => {
    if (coinFlip())
      [this.leftChild, this.rightChild] = [this.rightChild, this.leftChild];
  };

  toMathString(): string {
    return `(${this.leftChild.toMathString()})*(${this.rightChild.toMathString()})`;
  }

  toTex(options?: ToTexOptions): string {
    const opts = this.opts?.toTexOptions ?? options;
    const color = opts?.color;

    const childOpts = { ...opts };
    if (color) childOpts.color = undefined;

    let leftTex = this.leftChild.toTex(childOpts);
    let rightTex = this.rightChild.toTex(childOpts);
    if (
      !opts?.forceNoSimplification &&
      isNumberNode(this.leftChild) &&
      this.leftChild.value === 1 &&
      opts?.scientific === undefined
    ) {
      return colorize(rightTex, color);
    }

    if (isOperatorNode(this.leftChild)) {
      if (
        [OperatorIds.add, OperatorIds.substract, OperatorIds.divide].includes(
          this.leftChild.id,
        )
      )
        leftTex = `\\left(${leftTex}\\right)`;
    }

    let needBrackets = rightTex[0] === "-";
    if (isOperatorNode(this.rightChild)) {
      const operatorRightChild = this.rightChild;
      needBrackets ||= [OperatorIds.add, OperatorIds.substract].includes(
        operatorRightChild.id,
      );
    }
    if (needBrackets) rightTex = `\\left(${rightTex}\\right)`;
    if (leftTex === "-1" && !opts?.forceNoSimplification) {
      // if (!isNumberNode(this.rightChild)) {
      return colorize("-" + rightTex, color);
      // }
    }

    let showTimesSign =
      !opts?.forceDotSign &&
      (this.opts?.forceTimesSign ||
        !isNaN(+rightTex[0]) ||
        isNumberNode(this.rightChild) ||
        (isVariableNode(this.leftChild) &&
          isVariableNode(this.rightChild) &&
          this.leftChild.name === this.rightChild.name));
    if (isOperatorNode(this.rightChild)) {
      showTimesSign ||= [OperatorIds.fraction].includes(this.rightChild.id);
    }
    const cDotSign = opts?.forceDotSign ? ` \\cdot ` : "";
    const nextIsLetter =
      rightTex[0].toLowerCase() !== rightTex[0].toUpperCase();
    const prevIsCommand = leftTex.match(/\\[a-z]*$/);
    return colorize(
      `${leftTex}${
        showTimesSign
          ? `\\times${nextIsLetter ? " " : ""}`
          : prevIsCommand && nextIsLetter
          ? " "
          : ""
      }${cDotSign}${rightTex}`,
      color,
    );
  }

  toAllTexs() {
    const res: string[] = [];

    let leftTex = this.leftChild.toTex();
    let rightTex = this.rightChild.toTex();
    if (leftTex === "1") {
      // if (isNumberNode(this.rightChild)) {
      res.push(rightTex);
      // }
    }
    if (isOperatorNode(this.leftChild)) {
      if (
        [OperatorIds.add, OperatorIds.substract, OperatorIds.divide].includes(
          this.leftChild.id,
        )
      )
        leftTex = `\\left(${leftTex}\\right)`;
    }

    let needRightBrackets = rightTex[0] === "-";
    if (isOperatorNode(this.rightChild)) {
      needRightBrackets ||= [OperatorIds.add, OperatorIds.substract].includes(
        this.rightChild.id,
      );
    }
    if (needRightBrackets) rightTex = `\\left(${rightTex}\\right)`;
    if (leftTex === "-1") {
      // if (!isNumberNode(this.rightChild)) {
      res.push("-" + rightTex);
      // }
    }
    let mustShowTimesSign =
      !isNaN(+rightTex[0]) || isNumberNode(this.rightChild);

    const nextIsLetter =
      rightTex[0].toLowerCase() !== rightTex[0].toUpperCase();

    res.push(`${leftTex}${`\\times${nextIsLetter ? " " : ""}`}${rightTex}`);
    if (!needRightBrackets)
      res.push(
        `${leftTex}${`\\times${
          nextIsLetter ? " " : ""
        }`}\\left(${rightTex}\\right)`,
      );
    if (mustShowTimesSign) return res;

    res.push(`${leftTex}${rightTex}`);
    return res;
  }

  toEquivalentNodes(opts?: NodeOptions): MultiplyNode[] {
    const options = opts ?? this.opts;
    const res: MultiplyNode[] = [];

    const multiplyTree: (
      | AlgebraicNode
      | (AlgebraicNode | AlgebraicNode[])[]
    )[] = [];
    //ce seront des nodes qui ne sont pas des MultiNode
    //si l'élement est un array ca signifie qu'il faudra faire les produits cartésiens pour avoir toutes les possibilités
    //exp [2,[[5,5], 5^2], 3] -> il faudra faire les permutation sur [2,5,5,3] et sur [2,5^2,3]
    //!manque d'opti si [2,[5x5,5^2],[5x5,5^2]] par exp, mais par contruction on aura écrit ca [2,5^4]

    //1: choper le sous arbre de type Non Multi (ie les enfants nonMulti des Multi)
    const recursive = (node: AlgebraicNode) => {
      if (isOperatorNode(node)) {
        if (isMultiplyNode(node)) {
          recursive(node.leftChild);
          recursive(node.rightChild);
        } else if (
          isPowerNode(node) &&
          !options?.forbidPowerToProduct &&
          isNumberNode(node.rightChild)
        ) {
          //si power node avec power=int, créer un array contenant chaque décomposition de la puissnace possible
          //genre 5^2 : [[5,5], 5^2]
          //5^3  : [[5,5,5], [5,5^2], 5^3]
          const power = node.rightChild;
          if (isNumberNode(power)) {
            const powerNB = power.value;
            if (isInt(powerNB) && powerNB > 1) {
              const arr: (AlgebraicNode | AlgebraicNode[])[] = [
                new PowerNode(node.leftChild, node.rightChild, {
                  forbidPowerToProduct: true,
                }),
              ];
              for (let i = 0; i < powerNB - 1; i++) {
                const newPower = powerNB - (i + 1);
                if (newPower === 1) {
                  //que des nbs solos
                  const nbs = Array<AlgebraicNode>(powerNB).fill(
                    node.leftChild,
                  );
                  arr.push(nbs);
                } else {
                  //powerNb-newPower nbs solos
                  const newPowerNode = new PowerNode(
                    node.leftChild,
                    new NumberNode(newPower),
                    { forbidPowerToProduct: true },
                  );
                  const nbs = Array<AlgebraicNode>(powerNB - newPower).fill(
                    node.leftChild,
                  );
                  arr.push([...nbs, newPowerNode]);
                }
              }
              multiplyTree.push(arr);
            }
          }
        } else multiplyTree.push(node);
      } else multiplyTree.push(node);
    };
    recursive(this);

    const multiplyCartesians = getFlatCartesianProducts(
      multiplyTree.map((el) => (Array.isArray(el) ? el : [el])),
    );

    multiplyCartesians.forEach((multiplyCartesian) => {
      //2: pour tous les nodes qui ne sont pas Multi, on génère les equiv node
      const equivNodesArr = multiplyCartesian.map((node) =>
        node.toEquivalentNodes(opts),
      );
      //!pas opti car si [2,3,3] alors les 3 se permutent et donc double sortie [2,3_1,3_2], [2,3_2,3_1]
      //3: créer toutes les permutations de tous les nodes equiv
      let equivNodesPermutations = permute(equivNodesArr);
      equivNodesPermutations.forEach((permutation) => {
        //4: créé les produits cartésiens des nodes equiv puis nodify
        const cartesiansProducts = getCartesiansProducts(permutation);
        cartesiansProducts.forEach((product) => {
          res.push(operatorComposition(MultiplyNode, product));
        });
      });
    });

    return res;
  }

  toAllValidTexs(opts?: NodeOptions): string[] {
    return this.toEquivalentNodes(opts).flatMap((node) => node.toAllTexs());
  }
  toIdentifiers() {
    return {
      id: NodeIds.multiply,
      leftChild: this.leftChild.toIdentifiers(),
      rightChild: this.rightChild.toIdentifiers(),
    };
  }

  // toMathjs() {
  //   return multiply(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  // }

  evaluate(vars: Record<string, number>) {
    return this.leftChild.evaluate(vars) * this.rightChild.evaluate(vars);
  }

  copy() {
    return new MultiplyNode(this.leftChild, this.rightChild, this.opts);
  }
  canonicalOrder() {}
  simplify(opts?: SimplifyOptions): AlgebraicNode {
    const leftSimplified = this.leftChild.simplify(opts);
    const rightSimplified = this.rightChild.simplify(opts);
    const copy = new MultiplyNode(leftSimplified, rightSimplified, this.opts);

    /**get externals nodes
     * les opposites sont supprimés et on ajoute *-1 à la fin si leur nb est impair
     */
    let externals: AlgebraicNode[] = [];
    let oppositesCount = 0;

    const recursive = (node: AlgebraicNode) => {
      if (isMultiplyNode(node)) {
        recursive(node.leftChild);
        recursive(node.rightChild);
      } else if (isOppositeNode(node)) {
        oppositesCount++;
        recursive(node.child);
      } else {
        externals.push(node);
      }
    };
    recursive(copy);

    //si 0 on s'arrete
    if (externals.some((node) => isNumberNode(node) && node.value === 0)) {
      return new NumberNode(0);
    }

    if (oppositesCount % 2 === 1) {
      externals.unshift(new NumberNode(-1));
    }

    //suppression des 1
    externals = externals.filter(
      (node) => !isNumberNode(node) || node.value !== 1,
    );
    if (!externals.length) return new NumberNode(1);
    if (externals.length === 1) return externals[0];

    if (!opts?.forceDistributeFractions)
      if (externals.some((node) => isFractionNode(node))) {
        //s'il y a une fraction on transforme en fracNode
        const nums: AlgebraicNode[] = [];
        const denums: AlgebraicNode[] = [];
        externals.forEach((node) => {
          if (isFractionNode(node)) {
            nums.push(node.leftChild);
            denums.push(node.rightChild);
          } else nums.push(node);
        });
        if (nums.some((node) => isNumberNode(node) && node.value === 0)) {
          return new NumberNode(0);
        }
        sortMultiplyNodes(nums);
        sortMultiplyNodes(denums);
        const numNode = operatorComposition(MultiplyNode, nums);
        const denumNode =
          denums.length === 1
            ? denums[0]
            : operatorComposition(MultiplyNode, denums);
        return new FractionNode(numNode, denumNode).simplify(opts);
      }

    const simplifyExternalNodes = (a: AlgebraicNode, b: AlgebraicNode) => {
      if (isVariableNode(a) && isVariableNode(b)) {
        if (a.name === b.name) {
          return new SquareNode(a);
        }
      }
      if (isNumberNode(a) && isNumberNode(b)) {
        return new NumberNode(round(a.value * b.value, 12));
      }
      if (isSqrtNode(a) && isSqrtNode(b)) {
        return new SqrtNode(new MultiplyNode(a.child, b.child)).simplify(opts);
      }
      if (
        isNumberNode(a) &&
        isPowerNode(b) &&
        isNumberNode(b.leftChild) &&
        a.value === b.leftChild.value
      ) {
        return new PowerNode(
          b.leftChild,
          new AddNode(b.rightChild, (1).toTree()),
        ).simplify();
      }

      let powerSimplified = powerSimplify(a, b, opts);
      if (powerSimplified) return powerSimplified;
      powerSimplified = powerSimplify(b, a, opts);
      if (powerSimplified) return powerSimplified;

      //TODo continue
      return null;
    };
    //pour chaque paire on essaye de simplifier,
    //chaque simplification déclenche le reboot du process
    const simplifyIteration = () => {
      for (let i = 0; i < externals.length - 1; i++) {
        const left = externals[i];
        for (let j = i + 1; j < externals.length; j++) {
          const right = externals[j];
          const simplified = simplifyExternalNodes(left, right);
          if (simplified) {
            externals[i] = simplified;
            externals.splice(j, 1);
            if (isNumberNode(simplified) && simplified.value === 1) {
              externals.splice(i, 1);
            }
            simplifyIteration();
            return;
          }
        }
      }
    };
    simplifyIteration();
    if (!externals.length) return new NumberNode(1);
    if (externals.length === 1) return externals[0];
    return operatorComposition(MultiplyNode, externals);
  }

  equals(node: AlgebraicNode) {
    //!incorrect, il faut plutot vérifier qu'ils ont les meme externals
    return (
      isMultiplyNode(node) &&
      ((node.leftChild.equals(this.leftChild) &&
        node.rightChild.equals(this.rightChild)) ||
        (node.leftChild.equals(this.rightChild) &&
          node.rightChild.equals(this.leftChild)))
    );
  }
}

const powerSimplify = (
  a: AlgebraicNode,
  b: AlgebraicNode,
  opts?: SimplifyOptions,
): AlgebraicNode | void => {
  if (isPowerNode(a) && isPowerNode(b)) {
    if (a.leftChild.toTex() === b.leftChild.toTex())
      return new PowerNode(
        a.leftChild,
        new AddNode(a.rightChild, b.rightChild).simplify(opts),
      ).simplify(opts);
  }
  if (isVariableNode(a)) {
    if (isVariableNode(b) && b.toTex() === a.toTex() && opts?.keepPowers)
      return new PowerNode(a, new NumberNode(2)).simplify(opts);
    if (isPowerNode(b) && b.leftChild.toTex() === a.toTex()) {
      return new PowerNode(
        a,
        new AddNode(new NumberNode(1), b.rightChild).simplify(opts),
      ).simplify(opts);
    }
  }
};
