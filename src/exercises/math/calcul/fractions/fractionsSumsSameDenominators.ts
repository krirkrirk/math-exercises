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
import { primeFactors } from "#root/math/utils/arithmetic/primeFactors";
import { randint } from "#root/math/utils/random/randint";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { operatorComposition } from "#root/tree/utilities/operatorComposition";
import { alignTex } from "#root/utils/latex/alignTex";

type Identifiers = {
  denom: number;
  num1: number;
  num2: number;
};

const getFractionsSumsSameDenominatorsQuestion: QuestionGenerator<
  Identifiers
> = () => {
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
    instruction: `Calculer et donner le résultat sous forme d'une fraction irréductible : 
    
$$
${statement}
$$`,
    keys: [],
    hint: `Pour additionner deux fractions qui ont le même dénominateur, on peut additionner leurs numerateurs.`,
    correction: `Les deux fractions ont bien le même dénominateur donc on additionne leurs numérateurs : 
    
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
    ? "Cette fraction est bien irréductible."
    : `Puis on simplifie la fraction : 
    
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

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, denom, num1, num2 },
) => {
  const rationalA = new Rational(num1, denom);
  const rationalB = new Rational(num2, denom);

  const answerTree = rationalA
    .add(rationalB)
    .toTree({ allowFractionToDecimal: true });

  const texs = answerTree.toAllValidTexs();
  return texs.includes(ans);
};

export const fractionsSumsSameDenominators: Exercise<Identifiers> = {
  id: "fractionsSumsSameDenominators",
  connector: "=",
  label: "Sommes de fractions (avec même dénominateurs)",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getFractionsSumsSameDenominatorsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
