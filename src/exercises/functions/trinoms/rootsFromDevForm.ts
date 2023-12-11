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
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';
type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getRootsFromDevFormQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const trinom = TrinomConstructor.random();
  const answer = trinom.getRootsEquationSolutionTex();

  const question: Question<QCMProps, VEAProps> = {
    answer: answer,
    instruction: `Soit $f(x) = ${trinom.toTree().toTex()}$. Résoudre l'équation $f(x) = 0$.`,
    keys: ['S', 'equal', 'lbrace', 'semicolon', 'rbrace', 'emptyset'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, 'S=\\emptyset');
  while (propositions.length < n) {
    let wrongX1 = randint(-19, 0);
    let wrongX2 = randint(0, 20);
    const wrongAnswer = `S=\\left\\{${wrongX1};${wrongX2}\\right\\}`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const rootsFromDevForm: MathExercise<QCMProps, VEAProps> = {
  id: 'rootsFromDevForm',
  connector: '\\iff',
  getPropositions,

  label: 'Résoudre une équation du second degré',
  levels: ['1reSpé', 'TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Second degré'],
  generator: (nb: number) => getDistinctQuestions(getRootsFromDevFormQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};
