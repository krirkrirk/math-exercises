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
  GeneratorOption,
  GeneratorOptionTarget,
  GeneratorOptionType,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import {
  Rational,
  RationalConstructor,
} from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { rationalParser } from "#root/tree/parsers/rationalParser";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  num1: number;
  num2: number;
  denom1: number;
  denom2: number;
};

type Options = {
  allowNonIrreductible?: boolean;
};

const getFractionsSumsMultiplesDenominatorsQuestion: QuestionGenerator<
  Identifiers,
  Options
> = (opts) => {
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
    instruction: `Calculer ${
      opts?.allowNonIrreductible
        ? ""
        : "et donner le résultat sous la forme la plus simplifiée possible"
    } : 
    
$$
${statement}
$$`,
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

const isAnswerValid: VEA<Identifiers, Options> = (
  ans,
  { answer, denom1, denom2, num1, num2 },
  opts,
) => {
  const rationalA = new Rational(num1, denom1);
  const rationalB = new Rational(num2, denom2);

  const answerTree = rationalA
    .add(rationalB)
    .toTree({ allowFractionToDecimal: true });

  const texs = answerTree.toAllValidTexs();

  if (opts?.allowNonIrreductible) {
    try {
      const parsed = rationalParser(ans);
      if (!parsed) return false;
      return texs.includes(parsed.simplify().toTex());
    } catch (err) {
      return false;
    }
  } else return texs.includes(ans);
};

const options: GeneratorOption[] = [
  {
    id: "allowNonIrreductible",
    label: "Autoriser les fractions non réduites",
    target: GeneratorOptionTarget.vea,
    type: GeneratorOptionType.checkbox,
  },
];

export const fractionsSumsMultiplesDenominators: Exercise<Identifiers> = {
  id: "fractionsSumsMultiplesDenominators",
  connector: "=",
  label: "Sommes de fractions (avec dénominateurs multiples l'un de l'autre)",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb, opts) =>
    getDistinctQuestions(
      () => getFractionsSumsMultiplesDenominatorsQuestion(opts),
      nb,
    ),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  options,
};
