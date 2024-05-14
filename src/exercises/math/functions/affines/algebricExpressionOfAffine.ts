import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  a: number;
  b: number;
};

const getAlgebricExpressionOfAffineQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const f = AffineConstructor.random();
  const a = f.a;
  const b = f.b;

  const question: Question<Identifiers> = {
    answer: f.toTex(),
    instruction: `Soit une fonction affine $f$ dont le coefficient directeur vaut $${a}$ et l'ordonnée à l'origine vaut $${b}$. Écrire l'expression algébrique de $f(x)$.`,
    keys: ["x", "equal"],
    answerFormat: "tex",
    identifiers: { a, b },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(a, b).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  let random;
  while (propositions.length < n) {
    random = AffineConstructor.random();
    tryToAddWrongProp(propositions, random.toTree().toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b }) => {
  const f = new Affine(a, b, "x");
  return f.toTree().toAllValidTexs().includes(ans);
};

const generatePropositions = (a: number, b: number): string[] => {
  const firstProposition = new Affine(b, a, "x");
  const secondProposition = new Affine(a, -b, "x");
  return [
    firstProposition.toTree().toTex(),
    secondProposition.toTree().toTex(),
  ];
};

export const algebricExpressionOfAffine: Exercise<Identifiers> = {
  id: "algebricExpressionOfAffine",
  label:
    "Écrire l'expression algébrique d'une fonction affine connaissant les valeurs de son coefficient directeur et de son ordonnée à l'origine",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Fonctions affines"],
  generator: (nb: number) =>
    getDistinctQuestions(getAlgebricExpressionOfAffineQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
