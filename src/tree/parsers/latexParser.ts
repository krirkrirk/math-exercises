import { AlgebraicNode } from "../nodes/algebraicNode";
import { OppositeNode } from "../nodes/functions/oppositeNode";
import { SqrtNode } from "../nodes/functions/sqrtNode";
import { NumberNode } from "../nodes/numbers/numberNode";
import { AddNode } from "../nodes/operators/addNode";
import { FractionNode } from "../nodes/operators/fractionNode";
import { MultiplyNode, isMultiplyNode } from "../nodes/operators/multiplyNode";
import { PowerNode } from "../nodes/operators/powerNode";
import { SubstractNode } from "../nodes/operators/substractNode";
import { VariableNode } from "../nodes/variables/variableNode";

//cmd that needs a child, like \exp{3}
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

export const tokenize = (latex: string) => {
  const tokens: string[] = [];
  for (let i = 0; i < latex.length; i++) {
    const char = latex[i];
    if (char === " ") continue;
    const match = char.match(/[\+\-\(\)\^a-zA-Z_=\{\}]/);
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

export const parseLatex = (latex: string) => {
  const formattedLatex = latex
    .replaceAll("\\left", "")
    .replaceAll("\\right", "");
  const tokens = tokenize(formattedLatex);
  if (!isDyck(tokens)) throw Error("Problème de parenthèses.");

  try {
    const parsed = buildTree(tokens);
    return parsed;
  } catch (err) {
    throw err;
  }
};

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
  // console.log("depthed: ", depthedTokens);
  while (true) {
    if (maxDepth === 0) {
      const tree = buildTreeForSameDepthTokens(
        depthedTokens.map((el) => el.token),
      );
      return tree;
    }
    for (let i = 0; i < depthedTokens.length; i++) {
      const token = depthedTokens[i];
      if (token.depth < maxDepth) continue;
      //le token est forcément ici ( ou {
      //et on est sur qu'il n'y a aucun autre nestage à l'intérieur
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
      // console.log(`depthed after iter ${i}`, depthedTokens);
    }
    maxDepth--;
  }
};

const buildTreeForSameDepthTokens = (tokens: (string | AlgebraicNode)[]) => {
  // console.log("start: ", tokens);
  let tempTokens: (string | AlgebraicNode)[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (typeof token !== "string") {
      tempTokens[i] = token;
      continue;
    }
    if (token[0].match(/[0-9]/)) {
      tempTokens[i] = new NumberNode(Number(token));
    } else if (token[0].match(/[a-z]/i))
      tempTokens[i] = new VariableNode(token);
    //! les fonctions qui attendent un child ne sont pas encore parsées
    else if (functions.includes(token)) {
      tempTokens[i] = token;
    }
    //!idem pour les opérators
    else if (operators.includes(token)) tempTokens[i] = token;
    else throw Error(`token not implemented: ${token}`);
  }

  // console.log("after parses : ", tempTokens);
  //1 build les fct
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
        if (token === "+" || token === "-") {
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
