/**
 * a^b*a^c
 */

import { Power } from "#root/math/numbers/integer/power";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode, add } from "#root/tree/nodes/operators/addNode";
import {
  MultiplyNode,
  multiply,
} from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode, power } from "#root/tree/nodes/operators/powerNode";
import { alignTex } from "#root/utils/latex/alignTex";
import { shuffle } from "#root/utils/alea/shuffle";
import {
  Exercise,
  GetAnswer,
  GetCorrection,
  GetHint,
  GetInstruction,
  GetStartStatement,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";
import { v4 } from "uuid";
import { rationalParser } from "#root/tree/parsers/rationalParser";
import { powerParser } from "#root/tree/parsers/powerParser";

type Identifiers = {
  a: number;
  b: number;
  c: number;
};

type Options = {
  useOnlyPowersOfTen: boolean;
};

const getInstruction: GetInstruction<Identifiers, Options> = (
  identifiers,
  opts,
) => {
  const { a, b, c } = identifiers;
  const statement = multiply(power(a, b), power(a, c));

  const statmentTex = statement.toTex();

  return `Simplifier : 
  
$$
${statmentTex}
$$`;
};

const getStartStatement: GetStartStatement<Identifiers, Options> = (
  identifiers,
  opts,
) => {
  const { a, b, c } = identifiers;
  const statement = multiply(power(a, b), power(a, c));
  const statmentTex = statement.toTex();
  return statmentTex;
};

const getHint: GetHint<Identifiers, Options> = (identifiers, opts) => {
  return `Utilise la propriété :
  
$$
${
  opts?.useOnlyPowersOfTen
    ? `10^n \\times 10^m = 10^{n+m}`
    : `a^n \\times a^m = a^{n+m}`
}
$$
`;
};

const getCorrection: GetCorrection<Identifiers, Options> = (
  identifiers,
  opts,
) => {
  const { a, b, c } = identifiers;
  const addPower = power(a, add(b, c));
  return `On sait que : 
  
$$
${
  opts?.useOnlyPowersOfTen
    ? `10^n \\times 10^m = 10^{n+m}`
    : `a^n \\times a^m = a^{n+m}`
}
$$
    
On a donc : 

${alignTex([
  [multiply(power(a, b), power(a, c)).toTex(), "=", addPower.toTex()],
  ["", "=", addPower.simplify().toTex()],
])}
    `;
};

const getAnswer: GetAnswer<Identifiers, Options> = (identifiers) => {
  const { a, b, c } = identifiers;
  const answerTree = power(a, b + c, { allowPowerOne: false }).simplify();
  const answer = answerTree.toTex();
  return answer;
};
const getPowersProductQuestion: QuestionGenerator<Identifiers, Options> = (
  opts,
) => {
  const a = opts?.useOnlyPowersOfTen ? 10 : randint(-11, 11, [0]);
  const [b, c] = [1, 2].map((el) => randint(-11, 11));

  const identifiers = { a, b, c };
  const question: Question<Identifiers, Options> = {
    instruction: getInstruction(identifiers, opts),
    startStatement: getStartStatement(identifiers, opts),
    answer: getAnswer(identifiers),
    keys: [],
    answerFormat: "tex",
    identifiers,
    hint: getHint(identifiers, opts),
    correction: getCorrection(identifiers, opts),
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b, c }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const wrongExponent = b + c + randint(-11, 11, [0, -b - c]);
    const wrongAnswerTree = new Power(
      a === 1 || a === -1 ? randint(-3, 4, [-1, 1]) : a,
      wrongExponent,
    ).simplify();
    const wrongAnswer = wrongAnswerTree.toTex();

    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, c }) => {
  const powerNode = power(a, b + c);
  //version frac ou number
  //version power absolute
  //version 1/power
  const answerTree = powerNode.simplify();
  const ev = answerTree.evaluate();

  const parsed = rationalParser(ans);
  console.log(parsed, ev);
  if (parsed && Math.abs(parsed.evaluate() - ev) < 0.000001) return true;
  const powerParsed = powerParser(ans);
  if (powerParsed && Math.abs(powerParsed.evaluate() - ev) < 0.000001)
    return true;
  return false;
  // const texs = answerTree.toAllValidTexs();

  // const rawTex = powerNode.toTex();
  // if (!texs.includes(rawTex)) texs.push(rawTex);
  // return texs.includes(ans);
};

export const powersOfTenProduct: Exercise<Identifiers> = {
  id: "powersOfTenProduct",
  connector: "=",
  label: "Multiplication de puissances de 10",
  levels: [
    "4ème",
    "3ème",
    "2nde",
    "CAP",
    "2ndPro",
    "1reESM",
    "1rePro",
    "1reSpé",
    "1reTech",
    "TermPro",
    "TermTech",
  ],
  sections: ["Puissances"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(
      () => getPowersProductQuestion({ useOnlyPowersOfTen: true }),
      nb,
    ),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};

export const powersProduct: Exercise<Identifiers, Options> = {
  id: "powersProduct",
  connector: "=",
  label: "Multiplication de puissances",
  levels: ["4ème", "3ème", "2nde"],
  sections: ["Puissances"],
  isSingleStep: true,
  generator: (nb, opts) =>
    getDistinctQuestions(
      () => getPowersProductQuestion({ useOnlyPowersOfTen: false }),
      nb,
    ),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
  getAnswer,
  getCorrection,
  getHint,
  getInstruction,
  getStartStatement,
};
