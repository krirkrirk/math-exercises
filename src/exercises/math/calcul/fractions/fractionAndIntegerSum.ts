import {
  Exercise,
  GetAnswer,
  GetInstruction,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  RebuildIdentifiers,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { allowNonIrreductibleOption } from "#root/exercises/options/allowNonIrreductibleFractions";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { rationalVEA } from "#root/exercises/vea/rationalVEA";
import { Integer } from "#root/math/numbers/integer/integer";
import {
  Rational,
  RationalConstructor,
} from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { AddNode, add } from "#root/tree/nodes/operators/addNode";
import { frac } from "#root/tree/nodes/operators/fractionNode";
import { rationalParser } from "#root/tree/parsers/rationalParser";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  isIntegerFirst: boolean;
  integer: number;
  rational: [number, number];
};

const rebuildIdentifiers: RebuildIdentifiers<Identifiers> = (
  oldIdentifiers,
) => {
  if (oldIdentifiers.isIntegerFirst !== undefined) return oldIdentifiers;
  return {
    integer: oldIdentifiers.integer,
    isIntegerFirst: coinFlip(),
    rational: oldIdentifiers.rational,
  };
};

const getStatementNode = (identifiers: Identifiers) => {
  const ratio = frac(identifiers.rational[0], identifiers.rational[1]);
  const statement = identifiers.isIntegerFirst
    ? add(identifiers.integer, ratio)
    : add(ratio, identifiers.integer);
  return statement;
};
const getInstruction: GetInstruction<Identifiers, Options> = (
  identifiers,
  opts,
) => {
  const statement = getStatementNode(identifiers);

  return `Calculer ${
    opts?.allowNonIrreductible
      ? ""
      : "et donner le résultat sous la forme la plus simplifiée possible"
  } : 
  
$$
${statement.toTex()}
$$`;
};

const getAnswer: GetAnswer<Identifiers, Options> = (identifiers, opts) => {
  const answerTree = getStatementNode(identifiers);
  return answerTree.simplify().toTex();
};

const getFractionAndIntegerSum: QuestionGenerator<Identifiers, Options> = (
  opts,
) => {
  const rational = RationalConstructor.randomIrreductible();
  const integer = randint(-10, 11, [0]);
  const isIntegerFirst = coinFlip();
  const identifiers: Identifiers = {
    integer: integer,
    rational: [rational.num, rational.denum],
    isIntegerFirst,
  };
  const question: Question<Identifiers, Options> = {
    instruction: getInstruction(identifiers, opts),
    startStatement: getStatementNode(identifiers).toTex(),
    answer: getAnswer(identifiers, opts),
    keys: [],
    answerFormat: "tex",
    identifiers,
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, integer, rational },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const integerObj = new Integer(integer);
  const rationalObj = new Rational(rational[0], rational[1]);
  tryToAddWrongProp(
    propositions,
    new Rational(integerObj.value + rationalObj.num, rationalObj.denum).toTex(),
  );

  if (integerObj.value + rationalObj.denum !== 0)
    tryToAddWrongProp(
      propositions,
      new Rational(
        integerObj.value + rationalObj.num,
        integerObj.value + rationalObj.denum,
      ).toTex(),
    );

  while (propositions.length < n) {
    const rational = RationalConstructor.randomIrreductible();
    const wrongAnswerTree = rational.add(integerObj).toTree();
    tryToAddWrongProp(propositions, wrongAnswerTree.toTex());
  }

  return shuffle(propositions);
};

type Options = {
  allowNonIrreductible?: boolean;
};

const options = [allowNonIrreductibleOption];

const isAnswerValid: VEA<Identifiers, Options> = (
  ans,
  { answer, integer, rational },
  opts,
) => {
  return rationalVEA(ans, answer, {
    allowNonIrreductible: !!opts?.allowNonIrreductible,
  });
};

export const fractionAndIntegerSum: Exercise<Identifiers, Options> = {
  id: "fractionAndIntegerSum",
  connector: "=",
  label: "Somme d'un entier et d'une fraction",
  isSingleStep: false,
  generator: (nb, opts) =>
    getDistinctQuestions(() => getFractionAndIntegerSum(opts), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  options,
  getAnswer,
  getInstruction,
  rebuildIdentifiers,
};
