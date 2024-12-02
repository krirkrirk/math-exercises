import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { allowNonIrreductibleOption } from "#root/exercises/options/allowNonIrreductibleFractions";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Integer } from "#root/math/numbers/integer/integer";
import {
  Rational,
  RationalConstructor,
} from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { rationalParser } from "#root/tree/parsers/rationalParser";
import { shuffle } from "#root/utils/alea/shuffle";

const getFractionAndIntegerSum: QuestionGenerator<Identifiers, Options> = (
  opts,
) => {
  const rational = RationalConstructor.randomIrreductible();
  const integer = new Integer(randint(-10, 11, [0]));
  const statementTree = new AddNode(rational.toTree(), integer.toTree());
  statementTree.shuffle();
  const answerTree = rational.add(integer).toTree();
  const answer = answerTree.toTex();
  const question: Question<Identifiers, Options> = {
    instruction: `Calculer ${
      opts?.allowNonIrreductible
        ? ""
        : "et donner le résultat sous la forme la plus simplifiée possible"
    } : 
  
$$
${statementTree.toTex()}
$`,
    startStatement: statementTree.toTex(),
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      integer: integer.value,
      rational: [rational.num, rational.denum],
    },
  };
  return question;
};

type Identifiers = {
  integer: number;
  rational: [number, number];
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
  { integer, rational },
  opts,
) => {
  const integerObj = new Integer(integer);
  const rationalObj = new Rational(rational[0], rational[1]);
  const answerTree = rationalObj
    .add(integerObj)
    .toTree({ allowFractionToDecimal: true });
  const texs = answerTree.toAllValidTexs();
  if (opts?.allowNonIrreductible) {
    const parsed = rationalParser(ans);
    if (!parsed) return false;
    return texs.includes(parsed.simplify().toTex());
  } else {
    return texs.includes(ans);
  }
};

export const fractionAndIntegerSum: Exercise<Identifiers, Options> = {
  id: "fractionAndIntegerSum",
  connector: "=",
  label: "Somme d'un entier et d'une fraction",
  levels: ["4ème", "3ème", "2nde", "CAP", "2ndPro", "1rePro"],
  isSingleStep: false,
  sections: ["Fractions"],
  generator: (nb, opts) =>
    getDistinctQuestions(() => getFractionAndIntegerSum(opts), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  options,
};
