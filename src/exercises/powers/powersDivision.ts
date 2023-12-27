/**
 * a^b/a^c
 */

import { Power } from "#root/math/numbers/integer/power";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { shuffle } from "#root/utils/shuffle";
import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../exercise";
import { getDistinctQuestions } from "../utils/getDistinctQuestions";

type Identifiers = {
  a: number;
  b: number;
  c: number;
};

const getPowersDivisionQuestion: QuestionGenerator<
  Identifiers,
  { useOnlyPowersOfTen: boolean }
> = (opts) => {
  let a = opts!.useOnlyPowersOfTen ? 10 : randint(-11, 11, [0]);
  const [b, c] = [1, 2].map((el) => randint(-11, 11));

  const statement = new FractionNode(
    new PowerNode(new NumberNode(a), new NumberNode(b)),
    new PowerNode(new NumberNode(a), new NumberNode(c)),
  );
  const answerTree = new Power(a, b - c).simplify();
  const answer = answerTree.toTex();
  const question: Question<Identifiers> = {
    instruction: `Simplifier : $${statement.toTex()}$`,
    startStatement: statement.toTex(),
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: { a, b, c },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b, c }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const wrongPower = b - c + randint(-5, 6, [0, c - b]);
    const wrongAnswerTree = new Power(
      a === 1 || a === -1 ? randint(-3, 4, [-1, 1]) : a,
      wrongPower,
    ).simplify(); // pour éviter les 1 1 -1 1 dans propositions
    const wrongAnswer = wrongAnswerTree.toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, c }) => {
  const power = new Power(a, b - c);
  const answerTree = power.simplify();
  const texs = answerTree.toAllValidTexs();
  const rawTex = power.toTree().toTex();
  if (!texs.includes(rawTex)) texs.push(rawTex);
  return texs.includes(ans);
};
export const powersDivision: MathExercise<Identifiers> = {
  id: "powersDivision",
  connector: "=",
  label: "Division de puissances",
  levels: [
    "4ème",
    "3ème",
    "2nde",
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
      () => getPowersDivisionQuestion({ useOnlyPowersOfTen: false }),
      nb,
    ),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
export const powersOfTenDivision: MathExercise<Identifiers> = {
  id: "powersOfTenDivision",
  connector: "=",
  label: "Division de puissances de 10",
  levels: ["4ème", "3ème", "2nde"],
  sections: ["Puissances"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(
      () => getPowersDivisionQuestion({ useOnlyPowersOfTen: true }),
      nb,
    ),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
