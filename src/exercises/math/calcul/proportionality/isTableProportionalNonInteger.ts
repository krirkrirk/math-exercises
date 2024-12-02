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
  GeneratorOption,
  GeneratorOptionTarget,
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
import { coinFlip } from "#root/utils/alea/coinFlip";
import { random } from "#root/utils/alea/random";
import { doWhile } from "#root/utils/doWhile";
import { dollarize } from "#root/utils/latex/dollarize";
import { mdTable } from "#root/utils/markdown/mdTable";

type Identifiers = {
  coeffIds: any;
  xValues: any[];
  yValues: any[];
  isProportionnal: boolean;
  coeffType: string;
  valuesType: string;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Non", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");
  tryToAddWrongProp(propositions, "Oui", "raw");

  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return identifiers.isProportionnal ? "Oui" : "Non";
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const { xValues, yValues } = identifiers;
  const xTexs = xValues.map((x) => NodeConstructor.fromIdentifiers(x).toTex());
  const yTexs = yValues.map((y) => NodeConstructor.fromIdentifiers(y).toTex());
  return `Le tableau ci-dessous est-il un tableau de proportionnalité ?

${mdTable([xTexs.map((v) => dollarize(v)), yTexs.map((v) => dollarize(v))])}

  `;
};

// const getHint: GetHint<Identifiers> = (identifiers) => {};
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};

type Options = {
  coeffNumberTypes: string[];
  valuesNumberTypes: string[];
};
// ["Entier", "Décimal", "Fraction"],
// ["Entières", "Décimales", "Fractions"],
const getIsTableProportionalNonIntegerQuestion: QuestionGenerator<
  Identifiers,
  Options
> = (opts) => {
  const coeffType = random(
    opts?.coeffNumberTypes ?? ["Entier", "Décimal", "Fraction"],
  );
  if (!coeffType) throw Error("No Coeff Type");
  const valuesType = random(
    opts?.valuesNumberTypes ?? ["Entières", "Décimales", "Fractions"],
  );
  if (!valuesType) throw Error("No value type");

  let coeff: AlgebraicNode;
  let xValues: AlgebraicNode[] = [];
  const isProportionnal = coinFlip();

  coeff =
    coeffType === "Entier"
      ? randint(2, 10).toTree()
      : coeffType === "Décimal"
      ? randfloat(1.1, 10, 1).toTree()
      : RationalConstructor.randomPureRational().toTree();

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

  const yValues = isProportionnal
    ? xValues.map((x) => multiply(x, coeff).simplify())
    : xValues.map((x) => multiply(add(x, 1), coeff).simplify());

  const identifiers: Identifiers = {
    coeffIds: coeff.toIdentifiers(),
    xValues: xValues.map((e) => e.toIdentifiers()),
    yValues: yValues.map((e) => e.toIdentifiers()),
    isProportionnal: isProportionnal,
    valuesType,
    coeffType,
  };

  const question: Question<Identifiers, Options> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers, opts),
    keys: getKeys(identifiers),
    answerFormat: "raw",
    identifiers,
    // hint: getHint(identifiers),
    // correction: getCorrection(identifiers),
    style: {
      tableHasNoHeader: true,
    },
  };

  return question;
};

const options: GeneratorOption[] = [
  {
    id: "coeffNumberTypes",
    label: "Type du coefficient",
    type: GeneratorOptionType.multiselect,
    target: GeneratorOptionTarget.generation,
    values: ["Entier", "Décimal", "Fraction"],
  },
  {
    id: "valuesNumberTypes",
    label: "Type des valeurs",
    type: GeneratorOptionType.multiselect,
    target: GeneratorOptionTarget.generation,
    values: ["Entières", "Décimales", "Fractions"],
  },
];
export const isTableProportionalNonInteger: Exercise<Identifiers, Options> = {
  id: "isTableProportionalNonInteger",
  connector: "=",
  label: "Reconnaître un tableau de proportionnalité (valeurs non entières)",
  isSingleStep: true,
  generator: (nb, opts) =>
    getDistinctQuestions(
      () => getIsTableProportionalNonIntegerQuestion(opts),
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
