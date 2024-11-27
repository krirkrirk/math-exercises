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
import { dollarize } from "#root/utils/latex/dollarize";
import { mdTable } from "#root/utils/markdown/mdTable";

type Identifiers = {
  coeffIds: any;
  xValues: any[];
  yValues: any[];
  isProportionnal: boolean;
  type: number;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, "Non");
  tryToAddWrongProp(propositions, "On ne peut pas savoir");
  tryToAddWrongProp(propositions, "Oui");

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

const getIsTableProportionalNonIntegerQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const type = randint(1, 4);
  let coeff: AlgebraicNode;
  let xValues: AlgebraicNode[] = [];
  const isProportionnal = coinFlip();

  switch (type) {
    case 1:
      //coeff entier, valeurs décimal/frac
      coeff = randint(2, 10).toTree();
      xValues = [0, 1, 2]
        .map((e) =>
          coinFlip()
            ? randfloat(1.1, 10, 1).toTree()
            : RationalConstructor.randomIrreductible().toTree(),
        )
        .sort((a, b) => a.evaluate() - b.evaluate());
      break;
    case 2:
      //coeff décimal, valeurs entieres/décimal
      coeff = randfloat(1.1, 10, 1).toTree();
      xValues = [0, 1, 2]
        .map((e) =>
          coinFlip() ? randint(1, 10).toTree() : randfloat(1.1, 10, 1).toTree(),
        )
        .sort((a, b) => a.evaluate() - b.evaluate());
      break;

    case 3:
    //coeff frac, valeurs frac / entieres
    default:
      coeff = RationalConstructor.randomPureRational().toTree();

      xValues = [0, 1, 2]
        .map((e) =>
          coinFlip()
            ? randint(1, 10).toTree()
            : RationalConstructor.randomIrreductible().toTree(),
        )
        .sort((a, b) => a.evaluate() - b.evaluate());
  }
  const yValues = isProportionnal
    ? xValues.map((x) => multiply(x, coeff).simplify())
    : xValues.map((x) => multiply(add(x, random([-1, 1])), coeff).simplify());

  const identifiers: Identifiers = {
    coeffIds: coeff.toIdentifiers(),
    xValues: xValues.map((e) => e.toIdentifiers()),
    yValues: yValues.map((e) => e.toIdentifiers()),
    isProportionnal: isProportionnal,
    type,
  };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    // hint: getHint(identifiers),
    // correction: getCorrection(identifiers),
  };

  return question;
};

export const isTableProportionalNonInteger: Exercise<Identifiers> = {
  id: "isTableProportionalNonInteger",
  connector: "=",
  label: "Reconnaître un tableau de proportionnalité (valeurs non entières)",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getIsTableProportionalNonIntegerQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  // getHint,
  // getCorrection,
  getAnswer,
  answerType: "QCU",
};
