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
import { OppositeNode } from "#root/tree/nodes/functions/oppositeNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  param: string;
  a: number;
  alpha: number;
  beta: number;
};

const getAlphaBetaInCanonicalFormQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const trinom = TrinomConstructor.randomCanonical();
  const param = coinFlip() ? "\\alpha" : "\\beta";
  const alpha = trinom.getAlpha();
  const beta = trinom.getBeta();
  const alphaTex = trinom.getAlphaNode().toTex();
  const betaTex = trinom.getBetaNode().toTex();

  const answer = param === "\\alpha" ? alphaTex : betaTex;

  const question: Question<Identifiers> = {
    instruction: `Soit $f$ la fonction définie par $f(x) = ${trinom
      .getCanonicalForm()
      .toTex()}$. Que vaut $${param}$ ?`,
    answer: answer,
    keys: ["x", "alpha", "beta"],
    answerFormat: "tex",
    startStatement: param,
    identifiers: { param, a: trinom.a, alpha, beta },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, param, alpha, beta, a },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const alphaNode = new NumberNode(alpha);
  const alphaTex = alphaNode.toTex();
  const betaTex = new NumberNode(beta).toTex();
  tryToAddWrongProp(propositions, param === "\\alpha" ? betaTex : alphaTex);
  tryToAddWrongProp(
    propositions,
    new OppositeNode(new NumberNode(alpha)).toTex(),
  );

  tryToAddWrongProp(propositions, a.toString());

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 11) + "");
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, alpha, beta, param }) => {
  if (param === "\\alpha") {
    return ans === alpha.toString();
  } else {
    return ans === beta.toString();
  }
};

export const alphaBetaInCanonicalForm: MathExercise<Identifiers> = {
  id: "alphaInCanonicalForm",
  connector: "=",
  label: "Identifier $\\alpha$ et $\\beta$ dans la forme canonique",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Second degré"],
  generator: (nb: number) =>
    getDistinctQuestions(getAlphaBetaInCanonicalFormQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
