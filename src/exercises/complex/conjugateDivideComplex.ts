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

const getConjugateDivideComplexQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const z1 = ComplexConstructor.random();
  let z2: Complex;
  do {
    z2 = ComplexConstructor.random();
  } while (z1.im === 0 && z2.im === 0);

  const conjz1 = z1.conjugate();
  const conjz2 = z2.conjugate();

  const answerTex = conjz1.divideNode(conjz2).toTex();

  const question: Question<QCMProps, VEAProps> = {
    answer: answerTex,
    instruction: `Soit $z=${z1.toTree().toTex()}$ et $z'=${z2
      .toTree()
      .toTex()}$. Calculer le conjugué de $\\frac{z}{z'}$.`,
    keys: ['i', 'z', 'overline', 'quote'],
    answerFormat: 'tex',

    startStatement: "\\overline{\\frac{z}{z'}}",
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

export const conjugateDivideComplex: MathExercise<QCMProps, VEAProps> = {
  id: 'conjugateDivideComplex',
  connector: '=',
  label: "Conjugué d'une fraction de nombres complexes",
  levels: ['MathExp'],
  isSingleStep: true,
  sections: ['Nombres complexes'],
  generator: (nb: number) => getDistinctQuestions(getConjugateDivideComplexQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
