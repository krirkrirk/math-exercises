import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  k: number;
};
type VEAProps = {};

const getSquareRootEquationQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const k = Math.random() < 0.2 ? randint(-20, 0) : randint(0, 11);
  const answer = k < 0 ? 'S=\\emptyset' : `S=\\left\\{${k ** 2}\\right\\}`;

  const question: Question<QCMProps, VEAProps> = {
    answer: answer,
    instruction: `Résoudre l'équation suivante : $\\sqrt x = ${k}$`,
    keys: ['S', 'equal', 'lbrace', 'semicolon', 'rbrace', 'emptyset'],
    answerFormat: 'tex',
    qcmGeneratorProps: { k, answer },
  };

  return question;
};
const getPropositions: QCMGenerator<QCMProps> = (n, { answer, k }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  if (k >= 0) tryToAddWrongProp(propositions, 'S=\\emptyset');

  if (Math.sqrt(k) !== k ** 2) tryToAddWrongProp(propositions, `S=\\{\\sqrt{${k}}\\}`);

  while (propositions.length < n) {
    const wrongAnswer = `S=\\{${randint(1, 100)}\\}`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const squareRootEquation: MathExercise<QCMProps, VEAProps> = {
  id: 'squareRootEquation',
  connector: '\\iff',
  label: 'Résoudre une équation du type $\\sqrt x = k$',
  levels: ['2nde', '1reESM', '1reSpé'],
  isSingleStep: true,
  sections: ['Racines carrées', 'Équations', 'Fonctions de référence'],
  generator: (nb: number) => getDistinctQuestions(getSquareRootEquationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
