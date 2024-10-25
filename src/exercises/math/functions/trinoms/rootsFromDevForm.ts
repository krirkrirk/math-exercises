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
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  a: number;
  b: number;
  c: number;
};

const getRootsFromDevFormQuestion: QuestionGenerator<Identifiers> = () => {
  const trinom = TrinomConstructor.random();
  const answer = trinom.getRootsEquationSolutionTex();

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Soit $f(x) = ${trinom
      .toTree()
      .toTex()}$. Résoudre l'équation $f(x) = 0$.`,
    keys: ["S", "equal", "lbrace", "semicolon", "rbrace", "varnothing"],
    answerFormat: "tex",
    identifiers: { a: trinom.a, b: trinom.b, c: trinom.c },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, "S=\\varnothing");
  while (propositions.length < n) {
    let wrongX1 = randint(-19, 0);
    let wrongX2 = randint(0, 20);
    const wrongAnswer = `S=\\left\\{${wrongX1};${wrongX2}\\right\\}`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, c }) => {
  const trinom = new Trinom(a, b, c);
  const roots = trinom.getRootsNode();

  const answer = new EquationSolutionNode(new DiscreteSetNode(roots));
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const rootsFromDevForm: Exercise<Identifiers> = {
  id: "rootsFromDevForm",
  connector: "\\iff",
  getPropositions,

  label: "Résoudre une équation du second degré",
  levels: ["1reSpé", "TermSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Second degré"],
  generator: (nb: number) =>
    getDistinctQuestions(getRootsFromDevFormQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  isAnswerValid,
  subject: "Mathématiques",
  pdfOptions: { shouldSpreadPropositions: true },
};
