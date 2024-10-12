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
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  re: number;
  im: number;
};
const getInverseComplexQuestion: QuestionGenerator<Identifiers> = () => {
  const complex = ComplexConstructor.randomNotReal();
  const answer = complex.inverseNode().toTex();

  const question: Question<Identifiers> = {
    answer,
    instruction: `Déterminer l'inverse de $z=${complex.toTree().toTex()}$.`,
    keys: ["i"],
    answerFormat: "tex",
    identifiers: { re: complex.re, im: complex.im },
    startStatement: "\\frac{1}{z}",
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, re, im }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const complex = new Complex(re, im);
  const opposite = complex.opposite().toTree().toTex();
  tryToAddWrongProp(propositions, opposite);
  const conj = complex.conjugate().toTree().toTex();
  tryToAddWrongProp(propositions, conj);
  while (propositions.length < n) {
    const wrongAnswer = ComplexConstructor.random();

    tryToAddWrongProp(propositions, wrongAnswer.toTree().toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { re, im }) => {
  const z = new Complex(re, im);
  const inv = z.inverseNode();
  const texs = inv.toAllValidTexs({ allowFractionToDecimal: true });
  return texs.includes(ans);
};

export const inverseComplex: Exercise<Identifiers> = {
  id: "inverseComplex",
  connector: "=",
  label: "Inverse d'un nombre complexe",
  levels: ["MathExp"],
  isSingleStep: true,
  sections: ["Nombres complexes"],
  generator: (nb: number) =>
    getDistinctQuestions(getInverseComplexQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
