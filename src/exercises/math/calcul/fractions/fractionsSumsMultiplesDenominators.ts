import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import {
  Rational,
  RationalConstructor,
} from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  num1: number;
  num2: number;
  denom1: number;
  denom2: number;
};

const getFractionsSumsMultiplesDenominatorsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  let denom1 = randint(2, 10);
  let denom2 = denom1 * randint(2, 10);
  if (coinFlip()) [denom1, denom2] = [denom2, denom1];
  const num1 = randint(1, 10, [denom1]);
  const num2 = randint(1, 10, [denom2]);
  const ratio1 = new Rational(num1, denom1);
  const ratio2 = new Rational(num2, denom2);
  const statement = new AddNode(ratio1.toTree(), ratio2.toTree()).toTex();
  const answer = ratio1.add(ratio2).toTree().toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Calculer et donner le résultat sous forme de fraction irréductible : $${statement}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { num1, num2, denom1, denom2 },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, num1, num2, denom1, denom2 },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new Rational(num1 + num2, denom1 + denom2).simplify().toTree().toTex(),
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      RationalConstructor.randomIrreductible().toTree().toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, denom1, denom2, num1, num2 },
) => {
  const rationalA = new Rational(num1, denom1);
  const rationalB = new Rational(num2, denom2);

  const answerTree = rationalA
    .add(rationalB)
    .toTree({ allowFractionToDecimal: true });

  const texs = answerTree.toAllValidTexs();
  return texs.includes(ans);
};

export const fractionsSumsMultiplesDenominators: Exercise<Identifiers> = {
  id: "fractionsSumsMultiplesDenominators",
  connector: "=",
  label: "Sommes de fractions (avec dénominateurs multiples l'un de l'autre)",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getFractionsSumsMultiplesDenominatorsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
