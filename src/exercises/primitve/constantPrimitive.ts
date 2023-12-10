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
import { Monom } from '#root/math/polynomials/monom';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';

type QCMProps = {
  answer: string;
};
type VEAProps = {};

export const getConstantPrimitive: QuestionGenerator<QCMProps, VEAProps> = () => {
  const c = randint(-19, 20, [0]);
  const monom = new Monom(1, c);
  const answer = `${monom.toTex()}+C`;
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Déterminer la forme générale des primitives de la fonction constante $f$ définie par $f(x) = ${c}$.`,
    startStatement: `F(x)`,
    answer,
    keys: ['x', 'C'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer },
  };

  return question;
};
export const getConstantPrimitivePropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const wrongAnswer = `${randint(-9, 10, [-1, 0, 1])}x + C`;

    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const constantPrimitive: MathExercise<QCMProps, VEAProps> = {
  id: 'constantPrimitive',
  connector: '=',
  label: "Primitive d'une constante",
  levels: ['TermSpé', 'MathComp'],
  sections: ['Primitives'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getConstantPrimitive, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getConstantPrimitivePropositions,
};
