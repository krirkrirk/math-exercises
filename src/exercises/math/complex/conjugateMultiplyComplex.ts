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

const getConjugateMultiplyComplexQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const z1 = ComplexConstructor.random();
  let z2: Complex;
  do {
    z2 = ComplexConstructor.random();
  } while (z1.im === 0 && z2.im === 0);

  const prod = z1.multiply(z2);
  const conj = prod.conjugate();
  const answer = conj.toTree().toTex();

  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $z=${z1.toTree().toTex()}$ et $z'=${z2
      .toTree()
      .toTex()}$. Calculer $\\overline{z\\times z'}$.`,
    keys: ["i", "z", "overline", "quote"],
    answerFormat: "tex",

    startStatement: "\\overline{z\\times z'}",
    identifiers: { z1: [z1.re, z1.im], z2: [z2.re, z2.im] },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, z1, z2 }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const complex1 = new Complex(z1[0], z1[1]);
  const complex2 = new Complex(z2[0], z2[1]);
  const prod = complex1.multiply(complex2);
  tryToAddWrongProp(propositions, prod.toTree().toTex());
  while (propositions.length < n) {
    const wrongAnswer = ComplexConstructor.random();

    tryToAddWrongProp(propositions, wrongAnswer.toTree().toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { z1, z2 }) => {
  const complex1 = new Complex(z1[0], z1[1]);
  const complex2 = new Complex(z2[0], z2[1]);
  const answer = complex1.multiply(complex2).conjugate().toTree();
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const conjugateMultiplyComplex: Exercise<Identifiers> = {
  id: "conjugateMultiplyComplex",
  connector: "=",
  label: "Conjugué d'un produit de nombres complexes",
  levels: ["MathExp"],
  isSingleStep: true,
  sections: ["Nombres complexes"],
  generator: (nb: number) =>
    getDistinctQuestions(getConjugateMultiplyComplexQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
