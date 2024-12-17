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
import { rationalVEA } from "#root/exercises/vea/rationalVEA";
import { RationalConstructor } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import {
  NodeConstructor,
  NodeIdentifiers,
} from "#root/tree/nodes/nodeConstructor";
import { add } from "#root/tree/nodes/operators/addNode";
import { divide } from "#root/tree/nodes/operators/divideNode";
import { frac } from "#root/tree/nodes/operators/fractionNode";
import { multiply } from "#root/tree/nodes/operators/multiplyNode";
import { substract } from "#root/tree/nodes/operators/substractNode";
import { random } from "#root/utils/alea/random";
import { doWhile } from "#root/utils/doWhile";

type Identifiers = {
  statementIdentifiers: NodeIdentifiers;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      RationalConstructor.randomIrreductible(100).toTree().toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const statement = NodeConstructor.fromIdentifiers(
    identifiers.statementIdentifiers,
  );
  return statement.simplify().toTex();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const statement = NodeConstructor.fromIdentifiers(
    identifiers.statementIdentifiers,
  );
  return `Calculer : 
  
$$
${statement.toTex({ forceTimesSign: true })}
$$`;
};

// const getHint: GetHint<Identifiers> = (identifiers) => {};
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return rationalVEA(ans, answer);
};

const getFractionsOperationsQuestion: QuestionGenerator<Identifiers> = (
  ops,
) => {
  const operations = [add, substract, multiply, divide];

  const firstOpIndex = randint(0, operations.length);
  const secondOpIndex = randint(0, operations.length, [firstOpIndex]);
  const firstOp = operations[firstOpIndex];
  const secondOp = operations[secondOpIndex];

  const rationals = [
    RationalConstructor.randomIrreductible().toTree(),
    RationalConstructor.randomIrreductible().toTree(),
    RationalConstructor.randomIrreductible().toTree(),
  ];
  const statement = firstOp(secondOp(rationals[0], rationals[1]), rationals[2]);
  statement.shuffle();
  const ids = statement.toIdentifiers();

  const identifiers: Identifiers = {
    statementIdentifiers: ids,
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

export const fractionsOperations: Exercise<Identifiers> = {
  id: "fractionsOperations",
  connector: "=",
  label: "Calculs avec des fractions : mélange d'opérations",
  isSingleStep: true,
  generator: (nb, opts) =>
    getDistinctQuestions(() => getFractionsOperationsQuestion(opts), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getInstruction,
  // getHint,
  // getCorrection,
  getAnswer,
};
