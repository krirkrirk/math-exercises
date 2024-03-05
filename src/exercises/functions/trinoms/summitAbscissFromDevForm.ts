import {
  MathExercise,
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
import { Rational } from "#root/math/numbers/rationals/rational";
import { TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";

type Identifiers = {
  a: number;
  b: number;
  c: number;
};

const getSummitAbscissFromDevFormQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const trinom = TrinomConstructor.random();
  const alpha = trinom.getAlphaNode();
  const answer = alpha.toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $f(x) = ${trinom
      .toTree()
      .toTex()}$ une fonction polynôme du second degré. Quelle est l'abscisse du sommet de la parabole représentant $f$ ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: { a: trinom.a, b: trinom.b, c: trinom.c },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b, c }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new Rational(-b, a).simplify().toTree().toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new Rational(b, a).simplify().toTree().toTex(),
  );
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 10) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, c }) => {
  const node = new Rational(-b, 2 * a).simplify().toTree();
  const texs = node.toAllValidTexs({
    allowFractionToDecimal: true,
    allowMinusAnywhereInFraction: true,
  });
  return texs.includes(ans);
};
export const summitAbscissFromDevForm: MathExercise<Identifiers> = {
  id: "summitAbscissFromDevForm",
  connector: "=",
  label:
    "Déterminer l'abscisse du sommet d'une parabole en connaissant la forme développée",
  levels: ["1rePro", "1reSpé", "1reTech"],
  isSingleStep: true,
  sections: ["Second degré"],
  generator: (nb: number) =>
    getDistinctQuestions(getSummitAbscissFromDevFormQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
