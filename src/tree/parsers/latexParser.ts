import { isLetter } from "#root/utils/isLetter";
import { AlgebraicNode } from "../nodes/algebraicNode";
import { SqrtNode } from "../nodes/functions/sqrtNode";
import { NumberNode } from "../nodes/numbers/numberNode";

type Res = {
  node: AlgebraicNode;
  jump: number;
};
const isDyck = (latex: string) => {
  const brackets = latex.split("").filter((el) => el === "(" || el === ")");
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

export const parseLatex = (latex: string) => {
  const formattedLatex = latex
    .replaceAll("\\left", "")
    .replaceAll("\\right", "");
  const isWellBracketed = isDyck(latex);
  if (!isWellBracketed) throw Error("Problème de parenthèses.");

  let currentTree: AlgebraicNode;
  let currentItem: AlgebraicNode;
  const length = formattedLatex.length;
  try {
    const parsed = parseString(latex);
    return parsed.node;
  } catch (err) {
    throw err;
  }
};

const parseString = (latex: string): Res => {
  let currentTree: AlgebraicNode;
  let currentItem: AlgebraicNode;
  let currentAddCandidate: AlgebraicNode;

  const length = latex.length;
  let jump = 0;
  try {
    for (let i = 0; i < length; i++) {
      const char = latex[i];
      const parsed = parseItem(latex);
      currentItem = parsed.node;
      currentTree = parsed.node;
      jump = parsed.jump;
      i += parsed.jump;
    }
    return {
      node: currentTree!,
      jump,
    };
  } catch (err) {
    throw err;
  }
};

const parseItem = (latex: string): Res => {
  const length = latex.length;
  const char = latex[0];
  if (charIsNumber(char)) {
    return parseNumber(latex);
  } else if (char === "\\") {
    const cmdData = parseCommand(latex);
    switch (cmdData.cmd) {
      case "sqrt":
        const childLatex = getChildLatex(latex.substring(cmdData.jump));
        const parsedChild = parseString(childLatex);
        return {
          node: new SqrtNode(parsedChild.node),
          jump: parsedChild.jump,
        };
      default:
        throw Error(`Commande ${cmdData.cmd} non gérée`);
    }
  } else if (char === "+") {
  }
  throw Error(`Symbole ${char} non géré`);
};

/**
 *
 * @param latex latex[0] must be {
 *
 *
 * cette fonction extrait le latex d'un child,
 * par ex elle renverra "x" dans \\sqrt{x}
 */
const getChildLatex = (latex: string) => {
  const childStartIndex = 1;
  let leftBracesCount = 0;
  let childEndIndex = -1;
  for (let i = childStartIndex; i < latex.length; i++) {
    if (latex[i] === "{") leftBracesCount++;
    if (latex[i] === "}") {
      if (leftBracesCount === 0) {
        return latex.substring(1, i);
      } else leftBracesCount--;
    }
  }
  throw Error(`Erreur en récupérant un child dans ${latex}`);
};
/**
 *
 * @param latex latex[0] must be \
 */
const parseCommand = (latex: string): { cmd: string; jump: number } => {
  let nextChar = latex[1];
  const length = latex.length;
  if (!nextChar) throw Error("Antislash mais pas de nom de commande");
  let j = 1;
  let cmd = "";
  while (j < length && isLetter(nextChar)) {
    cmd += nextChar;
    j++;
    nextChar = latex[j];
  }
  return {
    cmd,
    jump: 1 + cmd.length,
  };
};

/**
 *
 * @param latex latex[0] must be a number
 * @returns
 */
const parseNumber = (latex: string): Res => {
  const char = latex[0];
  const length = latex.length;

  let numberString = char;
  let j = 1;
  let nextChar = latex[j];
  while (j < length && (charIsNumber(nextChar) || nextChar === ",")) {
    numberString += nextChar;
    j++;
    nextChar = latex[j];
  }
  if (numberString[numberString.length - 1] === ",")
    throw Error(
      `Nombre ${numberString} avec virgule mais sans partie décimale`,
    );
  if (numberString.split(",").length > 2)
    throw Error(`Trop de virgules dans le nombre ${numberString}`);
  const number = Number(numberString.replace(",", "."));
  return {
    node: new NumberNode(number),
    jump: numberString.length,
  };
};

/***
 * Nombres
 * Constantes
 * Opérations :
 *  - +
 *  - -
 *  - *
 *  - /
 * Fonctions :
 *  - exp
 *  - ln
 */

const charIsNumber = (s: string) => {
  return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(s);
};
