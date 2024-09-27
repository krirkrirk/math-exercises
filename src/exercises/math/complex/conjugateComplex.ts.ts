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
  re: number;
  im: number;
};

const getConjugateComplexQuestion: QuestionGenerator<Identifiers> = () => {
  const complex = ComplexConstructor.random();
  const answer = complex.conjugate().toTree().toTex();

  const question: Question<Identifiers> = {
    answer,
    instruction: `Déterminer le conjugué de $z=${complex.toTree().toTex()}$.`,
    keys: ["i", "overline"],
    answerFormat: "tex",
    startStatement: "\\overline z",
    identifiers: { re: complex.re, im: complex.im },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, re, im }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const complex = new Complex(re, im);
  const opposite = complex.opposite().toTree().toTex();
  tryToAddWrongProp(propositions, opposite);

  const conjOpposite = complex.conjugate().opposite().toTree().toTex();
  tryToAddWrongProp(propositions, conjOpposite);

  while (propositions.length < n) {
    const wrongAnswer = ComplexConstructor.random();
    tryToAddWrongProp(propositions, wrongAnswer.toTree().toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { im, re }) => {
  const complex = new Complex(re, im);
  const answer = complex.conjugate().toTree();
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const conjugateComplex: Exercise<Identifiers> = {
  id: "conjugateComplex",
  connector: "=",
  getPropositions,
  label: "Conjugué d'un nombre complexe",
  levels: ["MathExp"],
  isSingleStep: true,
  sections: ["Nombres complexes"],
  generator: (nb: number) =>
    getDistinctQuestions(getConjugateComplexQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  isAnswerValid,
  subject: "Mathématiques",
};
