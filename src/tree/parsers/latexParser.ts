import { InegalitySymbols } from "#root/math/inequations/inequation";
import { AlgebraicNode } from "../nodes/algebraicNode";
import { EqualNode } from "../nodes/equations/equalNode";
import { OppositeNode } from "../nodes/functions/oppositeNode";
import { SqrtNode } from "../nodes/functions/sqrtNode";
import { InequationNode } from "../nodes/inequations/inequationNode";
import { NumberNode, isNumberNode } from "../nodes/numbers/numberNode";
import { PiNode } from "../nodes/numbers/piNode";
import { AddNode } from "../nodes/operators/addNode";
import { FractionNode } from "../nodes/operators/fractionNode";
import { MultiplyNode, isMultiplyNode } from "../nodes/operators/multiplyNode";
import { PowerNode } from "../nodes/operators/powerNode";
import { SubstractNode } from "../nodes/operators/substractNode";
import { VariableNode } from "../nodes/variables/variableNode";

//cmds that needs a child, like \exp{3}
const functions = [
  "\\exp",
  "\\sqrt",
  "\\log",
  "\\ln",
  "\\cos",
  "\\sin",
  "\\frac",
];
const operators = ["+", "-", "\\div", "\\times", "^"];

//cmds childless, like \\pi
const symbols = [{ tex: "\\pi", node: PiNode }];

//separators between trees
const separators = ["=", "<", ">", "\\leq", "\\geq"];

//le nombre de parentheses est il respecté
const isDyck = (tokens: string[]) => {
  const brackets = tokens.filter((el) => el === "(" || el === ")");
  while (brackets.length) {
    const rightIndex = brackets.findIndex((el) => el == ")");
    if (rightIndex === -1 || rightIndex === 0) return false;
    let leftIndex = -1;
    for (let i = rightIndex - 1; i > -1; i--) {
      if (brackets[i] === "(") {
        leftIndex = i;
      }
      break;
    }
    if (leftIndex === -1) return false;
    brackets.splice(rightIndex, 1);
    brackets.splice(leftIndex, 1);
  }
  return true;
};

//?on push les nb, commands, variables, symboles dans un array de token
//?ex [3 ; +  ; \\pi ; \\frac ; { ; 2 ; x ; } ; { 3 ; x ; }]
export const tokenize = (latex: string) => {
  const tokens: string[] = [];
  for (let i = 0; i < latex.length; i++) {
    const char = latex[i];
    if (char === " ") continue;
    const match = char.match(/[\+\-\(\)\^a-zA-Z_=<>\{\}]/);
    if (match) {
      tokens.push(char);
      continue;
    }

    const substring = latex.substring(i);

    const nbMatch = substring.match(/^[0-9]+,?[0-9]*/); //x nombres éventuellement séparés par une virgule
    if (nbMatch) {
      tokens.push(nbMatch[0].replace(",", "."));
      i += nbMatch[0].length - 1;
      continue;
    }

    const cmdMatch = substring.match(/^\\[a-z]+/i);
    if (cmdMatch) {
      tokens.push(cmdMatch[0]);
      i += cmdMatch[0].length - 1;
      continue;
    }
  }
  return tokens;
};

export const parseAlgebraic = (latex: string) => {
  const formattedLatex = latex
    .replaceAll("\\left", "")
    .replaceAll("\\right", "");

  try {
    const tokens = tokenize(formattedLatex);
    if (!isDyck(tokens)) throw Error("Problème de parenthèses.");
    const parsed = buildTree(tokens);
    return parsed;
  } catch (err) {
    throw err;
  }
};

export const parseLatex = (latex: string) => {
  const formattedLatex = latex
    .replaceAll("\\left", "")
    .replaceAll("\\right", "");

  try {
    const tokens = tokenize(formattedLatex);
    if (!isDyck(tokens)) throw Error("Problème de parenthèses.");

    if (tokens.some((el) => separators.includes(el))) {
      const groups: (string | string[])[] = [];

      for (const token of tokens) {
        if (separators.includes(token)) {
          if (typeof groups[groups.length - 1] === "string") {
            throw Error("Consecutive separators not allowed");
          }
          groups.push(token);
        } else {
          if (Array.isArray(groups[groups.length - 1]))
            (groups[groups.length - 1] as string[]).push(token);
          else groups.push([token]);
        }
      }
      if (groups.length !== 3)
        throw Error("Consecutive separators not implemented");

      const children = [
        buildTree(groups[0] as string[]),
        buildTree(groups[2] as string[]),
      ];
      const parsed =
        groups[1] === "="
          ? new EqualNode(children[0], children[1])
          : new InequationNode(children, groups[1] as InegalitySymbols);
      return parsed;
    } else {
      const parsed = buildTree(tokens);
      return parsed;
    }
  } catch (err) {
    throw err;
  }
};

//? parcours en profondeur dans le sens où profondeur = ouverture d'un sous arbre math
//? genre dans 3exp(x^2) , x^2 est à la profondeur 2 et ^2 est pronfondeur 3
//
const buildTree = (tokens: string[]) => {
  let currentDepth = 0;
  let maxDepth = 0;
  const depthedTokens: { token: string | AlgebraicNode; depth: number }[] = [];
  for (const token of tokens) {
    if (token === "(" || token === "{") currentDepth++;
    depthedTokens.push({
      token,
      depth: currentDepth,
    });
    if (currentDepth > maxDepth) maxDepth = currentDepth;
    if (token === ")" || token === "}") currentDepth--;
  }

  //? on parcours en partant de profondeur max, pour chaque profondeur on build le tree de l'expression
  //? ce tree remplace les tokens de cette profondeur
  //? donc 3exp(x^2)
  //?    -> via tokenize : [3, exp, x, ^, 2]
  //?    -> to depthed: [{3, 0}, {exp, 0}, {x, 1}, {^, 1}, {2, 2}]
  //?    -> itération 1 : [{3, 0}, {exp, 0}, {x, 1}, {^, 1}, {NumberNode(2), 1}]
  //?    -> itération 2 : [{3, 0}, {exp, 0}, {SquareNode(x), 1}]
  //?    -> itération 3 : Multiply(3, ExpNode(SquareNode(x)))
  while (true) {
    if (maxDepth === 0) {
      const tree = buildTreeForSameDepthTokens(
        depthedTokens.map((el) => el.token),
      );
      return tree;
    }
    for (let i = 0; i < depthedTokens.length; i++) {
      const token = depthedTokens[i];
      //? on commence par les tokens de depth max
      if (token.depth < maxDepth) continue;
      //? le token est forcément ici ( ou {
      //? et on est sur qu'il n'y a aucun autre nestage à l'intérieur
      const endIndex = depthedTokens.findIndex(
        (el, index) => index > i && (el.token === ")" || el.token === "}"),
      );
      const tree = buildTreeForSameDepthTokens(
        depthedTokens.slice(i + 1, endIndex).map((el) => el.token),
      );
      depthedTokens.splice(i, endIndex - i + 1, {
        token: tree,
        depth: token.depth - 1,
      });
    }
    maxDepth--;
  }
};

const buildTreeForSameDepthTokens = (tokens: (string | AlgebraicNode)[]) => {
  //? à ce stade les tokens sont soit des charactères soit des nodes déjà build (par buildTree)
  //? ici on n'est dans une profondeur unique
  let tempTokens: (string | AlgebraicNode)[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    //?buildTree a déjà pu build des expressions de profondeur plus grande
    if (typeof token !== "string") {
      tempTokens[i] = token;
      continue;
    }

    //? les nombres, variables et symboles (pi) sont direct push en node
    if (token[0].match(/[0-9]/)) {
      tempTokens[i] = new NumberNode(Number(token));
    } else if (token[0].match(/[a-z]/i))
      tempTokens[i] = new VariableNode(token);
    else if (symbols.some((el) => el.tex === token)) {
      const obj = symbols.find((el) => el.tex === token)!;
      tempTokens[i] = obj.node;
    }

    //! les fonctions qui attendent un child ne sont pas encore parsées
    else if (functions.includes(token)) {
      tempTokens[i] = token;
    }
    //!idem pour les opérators
    else if (operators.includes(token)) tempTokens[i] = token;
    else throw Error(`token not implemented: ${token}`);
  }

  //?1 build les fct
  for (let i = 0; i < tempTokens.length; i++) {
    if (typeof tempTokens[i] !== "string") continue;
    const token = tempTokens[i] as string;

    if (functions.includes(token)) {
      if (typeof tempTokens[i + 1] === "string")
        throw Error(`Function child has not been parsed at index ${i}`);
      switch (token) {
        case "\\sqrt":
          tempTokens[i] = new SqrtNode(tempTokens[i + 1] as AlgebraicNode);
          tempTokens.splice(i + 1, 1);
          break;
        case "\\frac":
          tempTokens[i] = new FractionNode(
            tempTokens[i + 1] as AlgebraicNode,
            tempTokens[i + 2] as AlgebraicNode,
          );
          tempTokens.splice(i + 1, 2);
      }
    }
    if (token === "^") {
      if (
        !tempTokens[i - 1] ||
        typeof tempTokens[i - 1] === "string" ||
        !tempTokens[i + 1] ||
        typeof tempTokens[i + 1] === "string"
      )
        throw Error("Error parsing power node");
      else {
        tempTokens[i - 1] = new PowerNode(
          tempTokens[i - 1] as AlgebraicNode,
          tempTokens[i + 1] as AlgebraicNode,
        );
        tempTokens.splice(i, 2);
      }
    }
  }

  //2 build les opposites
  for (let i = 0; i < tempTokens.length; i++) {
    const token = tempTokens[i];
    if (token === "-") {
      if (
        i === 0 ||
        tempTokens[i - 1] === "\\times" ||
        tempTokens[i - 1] === "+" ||
        tempTokens[i - 1] === "-"
      ) {
        //faire la liste des - conéscutifs
        let j = i + 1;
        while (tempTokens[j] === "-" && j < tempTokens.length) {
          j++;
        }
        if (j === tempTokens.length) throw Error("Nothing after minus");
        const nextToken = tempTokens[j];
        //! à ce stade, le nextToken est soit un node, soit : + ou \\times
        //!on fait ici le choix d'interdire -+x
        if (typeof nextToken === "string") {
          throw Error("Opposé pas clair");
        }
        const oppositeCount = j - i;
        let node = nextToken;
        for (let k = 0; k < oppositeCount; k++) {
          node = new OppositeNode(node);
        }
        tempTokens[i] = node;
        tempTokens.splice(i + 1, oppositeCount);
      }
    }
  }

  // console.log("after fcts: ", tempTokens);
  //3 build les *
  let currentProduct: AlgebraicNode | undefined;
  let currentProductStartIndex: number | undefined;
  for (let i = 0; i < tempTokens.length; i++) {
    const token = tempTokens[i];
    if (token === "\\times") continue;
    //la seule chose qui arrete un produit est + ou -
    //y a t il d'autres cas ?
    //? rappel ici on est sur une expression de niveau uniforme (sans parentheses ni childs)
    if (token === "+" || token === "-") {
      if (
        currentProduct &&
        isMultiplyNode(currentProduct) &&
        currentProductStartIndex !== undefined
      ) {
        tempTokens[currentProductStartIndex] = currentProduct;
        tempTokens.splice(
          currentProductStartIndex + 1,
          i - currentProductStartIndex - 1,
        );
        i = currentProductStartIndex + 1;
      }
      currentProduct = undefined;
      currentProductStartIndex = undefined;
      continue;
    } else {
      if (currentProduct) {
        currentProduct = new MultiplyNode(
          currentProduct,
          token as AlgebraicNode,
        );
      } else {
        currentProduct = token as AlgebraicNode;
        currentProductStartIndex = i;
      }
    }
  }
  if (
    currentProduct &&
    isMultiplyNode(currentProduct) &&
    currentProductStartIndex !== undefined
  ) {
    tempTokens[currentProductStartIndex] = currentProduct;
    tempTokens.splice(
      currentProductStartIndex + 1,
      tempTokens.length - 1 - currentProductStartIndex,
    );
  }

  //4 build les +
  let currentAdd: AlgebraicNode | undefined;
  // console.log("beforeAdd", tempTokens);
  for (let i = 0; i < tempTokens.length; i++) {
    const token = tempTokens[i];
    if (!currentAdd) {
      if (typeof token === "string") {
        //ici on accepte +3 (mais seulement en début de tree)
        //donc +3 + X est ok
        //mais pas x \\times +3
        if (
          token === "+" &&
          !!tempTokens[i + 1] &&
          typeof tempTokens[i + 1] !== "string" &&
          isNumberNode(tempTokens[i + 1] as AlgebraicNode)
        ) {
          currentAdd = tempTokens[i + 1] as AlgebraicNode;
          i++;
        } else if (token === "+" || token === "-") {
          throw Error("Addition with no first term");
        } else throw Error(`unexpected non parsed token ${token}`);
      } else {
        currentAdd = token;
      }
    } else {
      if (typeof token !== "string" || (token !== "+" && token !== "-")) {
        throw Error(`unexpected consecutive nodes without addition : ${token}`);
      }
      const next = tempTokens[i + 1];
      if (typeof next === "string") {
        throw Error(`unexpected non parsed token ${next}`);
      } else {
        if (token === "+") currentAdd = new AddNode(currentAdd, next);
        else currentAdd = new SubstractNode(currentAdd, next);
        i++;
      }
    }
  }
  return currentAdd as AlgebraicNode;
};
