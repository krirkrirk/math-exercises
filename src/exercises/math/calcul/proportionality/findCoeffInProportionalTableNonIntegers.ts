import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  tryToAddWrongProp,
  GeneratorOptionType,
  GeneratorOptionTarget,
  GeneratorOption,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { RationalConstructor } from "#root/math/numbers/rationals/rational";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { NodeIds } from "#root/tree/nodes/node";
import { NodeConstructor } from "#root/tree/nodes/nodeConstructor";
import { add } from "#root/tree/nodes/operators/addNode";
import { multiply } from "#root/tree/nodes/operators/multiplyNode";
import { parseAlgebraic } from "#root/tree/parsers/latexParser";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { random } from "#root/utils/alea/random";
import { doWhile } from "#root/utils/doWhile";
import { dollarize } from "#root/utils/latex/dollarize";
import { mdTable } from "#root/utils/markdown/mdTable";

type Identifiers = {
  coeffIds: any;
  xValues: any[];
  yValues: any[];
  coeffType: string;
  valuesType: string;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, coeffType },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    switch (coeffType) {
      case "Entier":
        tryToAddWrongProp(propositions, randint(1, 10) + "");
        break;
      case "Décimal":
        tryToAddWrongProp(propositions, randfloat(1, 10, 1).frenchify());
        break;
      case "Fraction":
        tryToAddWrongProp(
          propositions,
          RationalConstructor.randomIrreductible().toTree().toTex(),
        );
        break;
    }
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return NodeConstructor.fromIdentifiers(identifiers.coeffIds).toTex();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const { xValues, yValues } = identifiers;
  const xTexs = xValues.map((x) => NodeConstructor.fromIdentifiers(x).toTex());
  const yTexs = yValues.map((y) => NodeConstructor.fromIdentifiers(y).toTex());
  return `On considère le tableau de proportionnalité suivant :

${mdTable([xTexs.map((v) => dollarize(v)), yTexs.map((v) => dollarize(v))])}

Quel est le coefficient de proportionnalité ?
  `;
};

// const getHint: GetHint<Identifiers> = (identifiers) => {};
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const parsed = parseAlgebraic(ans);
  if (!parsed) return false;
  return parsed.simplify().toTex() === answer;
};

const getFindCoeffInProportionalTableNonIntegersQuestion: QuestionGenerator<
  Identifiers,
  Options
> = (opts) => {
  let coeff: AlgebraicNode;
  let xValues: AlgebraicNode[] = [];
  const coeffType = random(
    opts?.coeffNumberTypes ?? ["Entier", "Décimal", "Fraction"],
  );
  if (!coeffType) throw Error("No Coeff Type");
  const valuesType = random(
    opts?.valuesNumberTypes ?? ["Entières", "Décimales", "Fractions"],
  );
  if (!valuesType) throw Error("No value type");

  coeff =
    coeffType === "Entier"
      ? randint(2, 10).toTree()
      : coeffType === "Décimal"
      ? randfloat(1.1, 10, 1).toTree()
      : RationalConstructor.randomPureRational(10).toTree();

  const getX = () => {
    return valuesType === "Entières"
      ? randint(1, 10).toTree()
      : valuesType === "Décimales"
      ? randfloat(1.1, 10, 1).toTree()
      : RationalConstructor.randomIrreductible().toTree();
  };

  for (let i = 0; i < 3; i++) {
    let x: AlgebraicNode = doWhile<AlgebraicNode>(getX, (y) =>
      xValues.some((x) => x.equals(y)),
    );
    xValues.push(x);
  }
  xValues.sort((a, b) => a.evaluate() - b.evaluate());

  const yValues = xValues.map((x) => multiply(x, coeff).simplify());

  const identifiers: Identifiers = {
    coeffIds: coeff.toIdentifiers(),
    xValues: xValues.map((e) => e.toIdentifiers()),
    yValues: yValues.map((e) => e.toIdentifiers()),
    coeffType,
    valuesType,
  };
  const question: Question<Identifiers, Options> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    // hint: getHint(identifiers),
    // correction: getCorrection(identifiers),
    style: {
      tableHasNoHeader: true,
    },
  };

  return question;
};
type Options = {
  coeffNumberTypes: string[];
  valuesNumberTypes: string[];
};
const options: GeneratorOption[] = [
  {
    id: "coeffNumberTypes",
    label: "Type du coefficient",
    type: GeneratorOptionType.multiselect,
    target: GeneratorOptionTarget.generation,
    values: ["Entier", "Décimal", "Fraction"],
    defaultValue: ["Entier", "Décimal", "Fraction"],
  },
  {
    id: "valuesNumberTypes",
    label: "Type des valeurs",
    type: GeneratorOptionType.multiselect,
    target: GeneratorOptionTarget.generation,
    values: ["Entières", "Décimales", "Fractions"],
    defaultValue: ["Entier", "Décimal", "Fraction"],
  },
];

export const findCoeffInProportionalTableNonIntegers: Exercise<
  Identifiers,
  Options
> = {
  id: "findCoeffInProportionalTableNonIntegers",
  connector: "=",
  label:
    "Calculer un coefficient de proportionnalité à partir d'un tableau (valeurs non entières)",
  isSingleStep: true,
  generator: (nb, opts) =>
    getDistinctQuestions(
      () => getFindCoeffInProportionalTableNonIntegersQuestion(opts),
      nb,
    ),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  // getHint,
  // getCorrection,
  getAnswer,
  answerType: "QCU",
  options,
};
