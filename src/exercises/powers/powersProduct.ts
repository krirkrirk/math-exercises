/**
 * a^b*a^c
 */

import { Power } from "#root/math/numbers/integer/power";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
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
import { v4 } from "uuid";

type QCMProps = {
  answer: string;
  a: number;
  b: number;
  c: number;
};
type VEAProps = {
  a: number;
  b: number;
  c: number;
};

const getPowersProductQuestion: QuestionGenerator<
  QCMProps,
  VEAProps,
  { useOnlyPowersOfTen: boolean }
> = (opts) => {
  const a = opts?.useOnlyPowersOfTen ? 10 : randint(-11, 11, [0]);
  const [b, c] = [1, 2].map((el) => randint(-11, 11));

  const statement = new MultiplyNode(
    new PowerNode(new NumberNode(a), new NumberNode(b)),
    new PowerNode(new NumberNode(a), new NumberNode(c)),
  );
  const answerTree = new Power(a, b + c).simplify();
  const answer = answerTree.toTex();
  const statmentTex = statement.toTex();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Calculer : $${statmentTex}$`,

    startStatement: statmentTex,
    answer,
    keys: [],
    answerFormat: "tex",
    qcmGeneratorProps: { answer, a, b, c },
  };
  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a, b, c }) => {
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

const isAnswerValid: VEA<VEAProps> = (ans, { a, b, c }) => {
  const power = new Power(a, b + c);
  const answerTree = power.simplify();
  const texs = answerTree.toAllValidTexs();
  const rawTex = power.toTree().toTex();
  if (!texs.includes(rawTex)) texs.push(rawTex);
  return texs.includes(ans);
};

export const powersOfTenProduct: MathExercise<QCMProps, VEAProps> = {
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
};

export const powersProduct: MathExercise<QCMProps, VEAProps> = {
  id: "powersProduct",
  connector: "=",
  label: "Multiplication de puissances",
  levels: ["4ème", "3ème", "2nde"],
  sections: ["Puissances"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(
      () => getPowersProductQuestion({ useOnlyPowersOfTen: false }),
      nb,
    ),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
