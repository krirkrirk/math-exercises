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
  z1: number[];
  z2: number[];
};
type VEAProps = {};
const getMutiplyComplexQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const z1 = ComplexConstructor.random();
  let z2: Complex;
  do {
    z2 = ComplexConstructor.random();
  } while (z1.im === 0 && z2.im === 0);

  const answer = z1.multiply(z2).toTree().toTex();

  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction: `Soit $z=${z1.toTree().toTex()}$ et $z'=${z2.toTree().toTex()}$. Calculer $z\\times z'$.`,
    keys: ['i', 'z', 'quote'],
    answerFormat: 'tex',

    startStatement: "z\\times z'",
    qcmGeneratorProps: { answer, z1: [z1.re, z1.im], z2: [z2.re, z2.im] },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, z1, z2 }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const prod = new Complex(z1[0], z1[1]).multiply(new Complex(z2[0], z2[1]));
  tryToAddWrongProp(propositions, prod.conjugate().toTree().toTex());
  while (propositions.length < n) {
    const wrongAnswer = ComplexConstructor.random();
    tryToAddWrongProp(propositions, wrongAnswer.toTree().toTex());
  }

  return shuffle(propositions);
};

export const mutiplyComplex: MathExercise<QCMProps, VEAProps> = {
  id: 'mutiplyComplex',
  connector: '=',
  label: 'Multiplier deux nombres complexes',
  levels: ['MathExp'],
  isSingleStep: true,
  sections: ['Nombres complexes'],
  generator: (nb: number) => getDistinctQuestions(getMutiplyComplexQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
