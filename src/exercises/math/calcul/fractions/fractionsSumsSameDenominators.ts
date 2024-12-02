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
import { primeFactors } from "#root/math/utils/arithmetic/primeFactors";
import { randint } from "#root/math/utils/random/randint";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { parseAlgebraic } from "#root/tree/parsers/latexParser";
import { numberParser } from "#root/tree/parsers/numberParser";
import { rationalParser } from "#root/tree/parsers/rationalParser";
import { operatorComposition } from "#root/tree/utilities/operatorComposition";
import { alignTex } from "#root/utils/latex/alignTex";

type Identifiers = {
  denom: number;
  num1: number;
  num2: number;
};

type Options = {
  allowNonIrreductible?: boolean;
};
const getFractionsSumsSameDenominatorsQuestion: QuestionGenerator<
  Identifiers,
  Options
> = (opts) => {
  const denom = randint(2, 15);
  const num1 = randint(1, denom + 10);
  const num2 = randint(1, denom + 10);
  const ratio1 = new Rational(num1, denom).toTree();
  const ratio2 = new Rational(num2, denom).toTree();
  const statement = new AddNode(ratio1, ratio2).toTex();
  const answerRatio = new Rational(num1 + num2, denom);
  const answer = answerRatio.simplify().toTree().toTex();
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
    hint: `Pour additionner deux fractions qui ont le même dénominateur, on peut additionner leurs numérateurs.`,
    correction: `Les deux fractions ont bien le même dénominateur, donc on additionne leurs numérateurs : 
    
${alignTex([
  [
    statement,
    "=",
    new FractionNode(
      new AddNode(num1.toTree(), num2.toTree()),
      denom.toTree(),
    ).toTex(),
  ],
  ["", "=", answerRatio.toTree().toTex()],
])}

${
  answerRatio.isSimplified && answerRatio.denum !== 1
    ? "Cette fraction est bien simplifiée."
    : `Puis, on simplifie la fraction : 
    
${alignTex([
  [
    answerRatio.toTree().toTex(),
    "=",
    new FractionNode(
      operatorComposition(
        MultiplyNode,
        primeFactors(num1 + num2).map((e) => e.toTree()),
      ),
      operatorComposition(
        MultiplyNode,
        primeFactors(denom).map((e) => e.toTree()),
      ),
    ).toTex(),
  ],
  ["", "=", answer],
])}`
}
    `,
    answerFormat: "tex",
    identifiers: { denom, num1, num2 },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, denom, num1, num2 },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new Rational(num1 + num2, denom * 2).simplify().toTree().toTex(),
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
  { answer, denom, num1, num2 },
  opts,
) => {
  const rationalA = new Rational(num1, denom);
  const rationalB = new Rational(num2, denom);

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
  } else {
    return texs.includes(ans);
  }
};

const options: GeneratorOption[] = [
  {
    id: "allowNonIrreductible",
    label: "Autoriser les fractions non réduites",
    target: GeneratorOptionTarget.vea,
    type: GeneratorOptionType.checkbox,
  },
];
export const fractionsSumsSameDenominators: Exercise<Identifiers> = {
  id: "fractionsSumsSameDenominators",
  connector: "=",
  label: "Sommes de fractions (avec même dénominateurs)",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb, opts) =>
    getDistinctQuestions(
      () => getFractionsSumsSameDenominatorsQuestion(opts),
      nb,
    ),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
  options,
};
