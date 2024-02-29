import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  param: string;
  coeffs: number[];
};

const getAlphaBetaFromDevFormQuestion: QuestionGenerator<Identifiers> = () => {
  const trinom = TrinomConstructor.randomCanonical();
  const param = coinFlip() ? "\\alpha" : "\\beta";
  const alphaTex = trinom.getAlphaNode().toTex();
  const betaTex = trinom.getBetaNode().toTex();
  const answer = param === "\\alpha" ? alphaTex : betaTex;

  const question: Question<Identifiers> = {
    answer: answer,
    keys: ["x", "alpha", "beta"],
    instruction: `Soit $f$ la fonction définie par $f(x) = ${trinom
      .toTree()
      .toTex()}$. Que vaut $${param}$ ?`,
    answerFormat: "tex",
    startStatement: param,
    identifiers: { coeffs: trinom.coefficients, param },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 11).toString());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const alphaBetaFromDevForm: MathExercise<Identifiers> = {
  id: "alphaBetaFromDevForm",
  connector: "=",
  label: "Déterminer $\\alpha$ ou $\\beta$ à partir de la forme développée",
  levels: ["1reSpé"],
  isSingleStep: false,
  sections: ["Second degré"],
  generator: (nb: number) =>
    getDistinctQuestions(getAlphaBetaFromDevFormQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
