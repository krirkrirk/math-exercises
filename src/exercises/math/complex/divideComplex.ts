import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Complex, ComplexConstructor } from "#root/math/complex/complex";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  z1: number[];
  z2: number[];
};

const getDivideComplexQuestion: QuestionGenerator<Identifiers> = () => {
  const z1 = ComplexConstructor.random();
  let z2: Complex;
  do {
    z2 = ComplexConstructor.random();
  } while (z1.im === 0 && z2.im === 0);

  const answerTex = z1.divideNode(z2).toTex();

  const question: Question<Identifiers> = {
    answer: answerTex,
    instruction: `Soit $z=${z1.toTree().toTex()}$ et $z'=${z2
      .toTree()
      .toTex()}$. Calculer $\\frac{z}{z'}$.`,
    keys: ["i", "z", "quote"],
    answerFormat: "tex",

    startStatement: "\\frac{z}{z'}",
    identifiers: {
      z1: [z1.re, z1.im],
      z2: [z2.re, z2.im],
    },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const wrongAnswer = ComplexConstructor.random();
    tryToAddWrongProp(propositions, wrongAnswer.toTree().toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { z1, z2 }) => {
  const complex1 = new Complex(z1[0], z1[1]);
  const complex2 = new Complex(z2[0], z2[1]);
  const divide = complex1.divideNode(complex2);
  const texs = divide.toAllValidTexs({ allowFractionToDecimal: true });
  return texs.includes(ans);
};

export const divideComplex: Exercise<Identifiers> = {
  id: "divideComplex",
  connector: "=",
  label: "Diviser deux nombres complexes",
  levels: ["MathExp"],
  isSingleStep: true,
  sections: ["Nombres complexes"],
  generator: (nb: number) => getDistinctQuestions(getDivideComplexQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
