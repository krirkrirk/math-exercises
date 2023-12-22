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
import { randint } from "#root/math/utils/random/randint";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import {
  DiscreteSetNode,
  EmptySet,
} from "#root/tree/nodes/sets/discreteSetNode";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";

type QCMProps = {
  answer: string;
  k: number;
};
type VEAProps = {
  k: number;
};

const getSquareRootEquationQuestion: QuestionGenerator<
  QCMProps,
  VEAProps
> = () => {
  const k = Math.random() < 0.2 ? randint(-20, 0) : randint(0, 11);
  const answer = k < 0 ? "S=\\emptyset" : `S=\\left\\{${k ** 2}\\right\\}`;

  const question: Question<QCMProps, VEAProps> = {
    answer: answer,
    instruction: `Résoudre l'équation suivante : $\\sqrt x = ${k}$`,
    keys: ["S", "equal", "lbrace", "semicolon", "rbrace", "emptyset"],
    answerFormat: "tex",
    qcmGeneratorProps: { k, answer },
  };

  return question;
};
const getPropositions: QCMGenerator<QCMProps> = (n, { answer, k }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  if (k >= 0) tryToAddWrongProp(propositions, "S=\\emptyset");

  if (Math.sqrt(k) !== k ** 2)
    tryToAddWrongProp(propositions, `S=\\{\\sqrt{${k}}\\}`);

  while (propositions.length < n) {
    const wrongAnswer = `S=\\{${randint(1, 100)}\\}`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<VEAProps> = (ans, { k }) => {
  const solution =
    k < 0 ? EmptySet : new DiscreteSetNode([new NumberNode(k ** 2)]);
  const answerTree = new EquationSolutionNode(solution);
  const validLatexs = answerTree.toAllValidTexs();
  return validLatexs.includes(ans);
};
export const squareRootEquation: MathExercise<QCMProps, VEAProps> = {
  id: "squareRootEquation",
  connector: "\\iff",
  label: "Résoudre une équation du type $\\sqrt x = k$",
  levels: ["2nde", "1reESM", "1reSpé"],
  isSingleStep: true,
  sections: ["Racines carrées", "Équations", "Fonctions de référence"],
  generator: (nb: number) =>
    getDistinctQuestions(getSquareRootEquationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
