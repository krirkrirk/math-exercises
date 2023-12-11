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
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { SubstractNode } from '#root/tree/nodes/operators/substractNode';
import { simplifyComplex } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';

type QCMProps = {
  answer: string;
  z1Re: number;
  z1Im: number;
  z2Re: number;
  z2Im: number;
};
type VEAProps = {};

const getAddComplexQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const z1 = ComplexConstructor.random();
  let z2: Complex;
  do {
    z2 = ComplexConstructor.random();
  } while (z1.im === 0 && z2.im === 0);

  const answer = simplifyComplex(new AddNode(z1.toTree(), z2.toTree())).toTex();

  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction: `Soit $z=${z1.toTree().toTex()}$ et $z'=${z2.toTree().toTex()}$. Calculer $z + z'$.`,
    keys: ['i', 'z', 'quote'],
    answerFormat: 'tex',
    startStatement: "z+z'",
    qcmGeneratorProps: { answer, z1Re: z1.re, z1Im: z1.im, z2Re: z2.re, z2Im: z2.im },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, z1Re, z1Im, z2Re, z2Im }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const z1 = new Complex(z1Re, z1Im);
  const z2 = new Complex(z2Re, z2Im);
  tryToAddWrongProp(propositions, simplifyComplex(new SubstractNode(z1.toTree(), z2.toTree())).toTex());
  while (propositions.length < n) {
    const wrongAnswer = ComplexConstructor.random();
    tryToAddWrongProp(propositions, wrongAnswer.toTree().toTex());
  }
  return shuffle(propositions);
};

export const addComplex: MathExercise<QCMProps, VEAProps> = {
  id: 'addComplex',
  connector: '=',
  label: 'Additionner deux nombres complexes',
  levels: ['MathExp'],
  isSingleStep: true,
  sections: ['Nombres complexes'],
  generator: (nb: number) => getDistinctQuestions(getAddComplexQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
