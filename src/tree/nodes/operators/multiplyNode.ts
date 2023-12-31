// import { multiply } from "mathjs";
import { Node, NodeOptions, NodeType } from "../node";
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
import { PowerNode, isPowerNode } from "./powerNode";
import { NumberNode, isNumberNode } from "../numbers/numberNode";
import { isInt } from "#root/utils/isInt";
import { isVariableNode } from "../variables/variableNode";
import { AlgebraicNode } from "../algebraicNode";
export function isMultiplyNode(a: Node): a is MultiplyNode {
  return isOperatorNode(a) && a.id === OperatorIds.multiply;
}
export class MultiplyNode implements CommutativeOperatorNode {
  opts?: NodeOptions;
  id: OperatorIds;
  leftChild: AlgebraicNode;
  rightChild: AlgebraicNode;
  type: NodeType;
  constructor(
    leftChild: AlgebraicNode,
    rightChild: AlgebraicNode,
    opts?: NodeOptions,
  ) {
    // let [left, right] = [leftChild, rightChild];
    // const shouldSwitch =
    //   (rightChild.type === NodeType.function &&
    //     (rightChild as FunctionNode).id === FunctionsIds.opposite) ||
    //   (leftChild.type === NodeType.constant &&
    //     rightChild.type === NodeType.number);
    // if (shouldSwitch) {
    //   [left, right] = [rightChild, leftChild];
    // }
    this.id = OperatorIds.multiply;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.type = NodeType.operator;
    this.opts = opts;
  }

  shuffle = () => {
    if (coinFlip())
      [this.leftChild, this.rightChild] = [this.rightChild, this.leftChild];
  };

  toMathString(): string {
    return `(${this.leftChild.toMathString()})*(${this.rightChild.toMathString()})`;
  }

  toTex(): string {
    let leftTex = this.leftChild.toTex();
    let rightTex = this.rightChild.toTex();

    if (leftTex === "1") {
      // if (isNumberNode(this.rightChild) || isVariableNode(this.rightChild)) {
      return rightTex;
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

    let needBrackets = rightTex[0] === "-";
    if (isOperatorNode(this.rightChild)) {
      const operatorRightChild = this.rightChild;
      needBrackets ||= [OperatorIds.add, OperatorIds.substract].includes(
        operatorRightChild.id,
      );
    }
    if (needBrackets) rightTex = `\\left(${rightTex}\\right)`;
    if (leftTex === "-1") {
      if (!isNumberNode(this.rightChild)) {
        return "-" + rightTex;
      }
    }

    let showTimesSign =
      this.opts?.forceTimesSign ||
      !isNaN(+rightTex[0]) ||
      isNumberNode(this.rightChild) ||
      (isVariableNode(this.leftChild) &&
        isVariableNode(this.rightChild) &&
        this.leftChild.name === this.rightChild.name);
    if (isOperatorNode(this.rightChild)) {
      showTimesSign ||= [OperatorIds.fraction].includes(this.rightChild.id);
    }
    const nextIsLetter =
      rightTex[0].toLowerCase() !== rightTex[0].toUpperCase();
    return `${leftTex}${
      showTimesSign ? `\\times${nextIsLetter ? " " : ""}` : ""
    }${rightTex}`;
  }

  toAllTexs() {
    const res: string[] = [];

    let leftTex = this.leftChild.toTex();
    let rightTex = this.rightChild.toTex();
    if (leftTex === "1") {
      if (isNumberNode(this.rightChild)) {
        res.push(rightTex);
      }
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
      if (!isNumberNode(this.rightChild)) {
        res.push("-" + rightTex);
      }
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

  // toMathjs() {
  //   return multiply(this.leftChild.toMathjs(), this.rightChild.toMathjs());
  // }

  evaluate(vars: Record<string, number>) {
    return this.leftChild.evaluate(vars) * this.rightChild.evaluate(vars);
  }
}
