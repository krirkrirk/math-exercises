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
import { Complex, ComplexConstructor } from '#root/math/complex/complex';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';
type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getDivideComplexQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const z1 = ComplexConstructor.random();
  let z2: Complex;
  do {
    z2 = ComplexConstructor.random();
  } while (z1.im === 0 && z2.im === 0);

  const answerTex = z1.divideNode(z2).toTex();

  const question: Question<QCMProps, VEAProps> = {
    answer: answerTex,
    instruction: `Soit $z=${z1.toTree().toTex()}$ et $z'=${z2.toTree().toTex()}$. Calculer $\\frac{z}{z'}$.`,
    keys: ['i', 'z', 'quote'],
    answerFormat: 'tex',

    startStatement: "\\frac{z}{z'}",
    qcmGeneratorProps: { answer: answerTex },
  };

  return question;
};
const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const wrongAnswer = ComplexConstructor.random();
    tryToAddWrongProp(propositions, wrongAnswer.toTree().toTex());
  }

  return shuffle(propositions);
};

export const divideComplex: MathExercise<QCMProps, VEAProps> = {
  id: 'divideComplex',
  connector: '=',
  label: 'Diviser deux nombres complexes',
  levels: ['MathExp'],
  isSingleStep: true,
  sections: ['Nombres complexes'],
  generator: (nb: number) => getDistinctQuestions(getDivideComplexQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
