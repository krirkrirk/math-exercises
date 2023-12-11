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
import { VectorConstructor } from '#root/math/geometry/vector';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';

type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getDeterminantQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const u = VectorConstructor.random('u');
  const v = VectorConstructor.random('v');
  const answer = u.determinant(v);

  const question: Question<QCMProps, VEAProps> = {
    answer: answer.toTex(),
    instruction: `Soient les vecteurs $${u.toTexWithCoords()}$ et $${v.toTexWithCoords()}$. Calculer le déterminant $\\det(\\overrightarrow u;\\overrightarrow v)$.`,
    keys: [],
    answerFormat: 'tex',
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, u.scalarProduct(v).toTex());

  while (propositions.length < n) {
    const wrongAnswer = randint(-20, 20) + '';
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const determinant: MathExercise<QCMProps, VEAProps> = {
  id: 'determinant',
  connector: '=',
  label: 'Calculer le déterminant de deux vecteurs',
  levels: ['2nde', '1reESM', '1reSpé'],
  isSingleStep: true,
  sections: ['Vecteurs'],
  generator: (nb: number) => getDistinctQuestions(getDeterminantQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
