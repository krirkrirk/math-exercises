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
import { parseAlgebraic } from "#root/tree/parsers/latexParser";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { random } from "#root/utils/alea/random";
import { dollarize } from "#root/utils/latex/dollarize";
import { mdTable } from "#root/utils/markdown/mdTable";

type Identifiers = {
  coeffIds: any;
  xValues: any[];
  yValues: any[];
  type: number;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, type }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    switch (type) {
      case 1:
        tryToAddWrongProp(propositions, randint(1, 10) + "");
        break;
      case 2:
        tryToAddWrongProp(propositions, randfloat(1, 10, 1).frenchify());
        break;
      case 3:
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
  Identifiers
> = () => {
  const type = randint(1, 4);
  let coeff: AlgebraicNode;
  let xValues: AlgebraicNode[] = [];
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
  const yValues = xValues.map((x) => multiply(x, coeff).simplify());

  const identifiers: Identifiers = {
    coeffIds: coeff.toIdentifiers(),
    xValues: xValues.map((e) => e.toIdentifiers()),
    yValues: yValues.map((e) => e.toIdentifiers()),
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

export const findCoeffInProportionalTableNonIntegers: Exercise<Identifiers> = {
  id: "findCoeffInProportionalTableNonIntegers",
  connector: "=",
  label:
    "Calculer un coefficient de proportionnalité à partir d'un tableau (valeurs non entières)",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(
      getFindCoeffInProportionalTableNonIntegersQuestion,
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
};
