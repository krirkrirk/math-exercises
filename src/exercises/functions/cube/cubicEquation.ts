import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { equationKeys } from "#root/exercises/utils/keys/equationKeys";
import { randint } from "#root/math/utils/random/randint";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";

type QCMProps = {
  answer: string;
  k: number;
};
type VEAProps = {
  k: number;
};
const getCubicEquationQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const x = randint(-10, 11);
  const k = x ** 3;
  const answer = `S=\\left\\{${x}\\right\\}`;

  const question: Question<QCMProps, VEAProps> = {
    answer: answer,
    instruction: `Résoudre l'équation suivante : $x^3 = ${k}$`,
    keys: equationKeys,
    answerFormat: "tex",
    qcmGeneratorProps: { answer, k },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, k }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, `S=\\{${k ** 3}\\}`);

  while (propositions.length < n) {
    const wrongAnswer = randint(-10, 11) + "";
    tryToAddWrongProp(propositions, `S=\\{${wrongAnswer}\\}`);
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<VEAProps> = (ans, { k }) => {
  const sol = Math.cbrt(k);
  const answerTree = new EquationSolutionNode(
    new DiscreteSetNode([new NumberNode(sol)]),
  );
  const texs = answerTree.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};
export const cubicEquation: MathExercise<QCMProps, VEAProps> = {
  id: "cubicEquation",
  connector: "\\iff",
  label: "Résoudre une équation du type $x^3 = k$",
  levels: ["2nde", "1reESM", "1reSpé", "1reTech"],
  isSingleStep: true,
  sections: ["Fonctions de référence", "Fonction cube", "Équations"],
  generator: (nb: number) =>
    getDistinctQuestions(getCubicEquationQuestion, nb, 20),
  isAnswerValid,
  qcmTimer: 60,
  freeTimer: 60,
  maxAllowedQuestions: 20,
  getPropositions,
};
