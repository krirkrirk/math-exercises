import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Integer } from "#root/math/numbers/integer/integer";
import {
  Rational,
  RationalConstructor,
} from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { shuffle } from "#root/utils/shuffle";

const getFractionAndIntegerSum: QuestionGenerator<Identifiers> = () => {
  const rational = RationalConstructor.randomIrreductible();
  const integer = new Integer(randint(-10, 11, [0]));
  const statementTree = new AddNode(rational.toTree(), integer.toTree());
  statementTree.shuffle();
  const answerTree = rational.add(integer).toTree();
  const answer = answerTree.toTex();
  const question: Question<Identifiers> = {
    instruction: `Calculer et donner le résultat sous la forme d'une fraction irréductible : $${statementTree.toTex()}$`,
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

const isAnswerValid: VEA<Identifiers> = (ans, { integer, rational }) => {
  const integerObj = new Integer(integer);
  const rationalObj = new Rational(rational[0], rational[1]);
  const answerTree = rationalObj
    .add(integerObj)
    .toTree({ allowFractionToDecimal: true });
  const texs = answerTree.toAllValidTexs();
  return texs.includes(ans);
};

export const fractionAndIntegerSum: MathExercise<Identifiers> = {
  id: "fractionAndIntegerSum",
  connector: "=",
  label: "Somme d'un entier et d'une fraction",
  levels: ["4ème", "3ème", "2nde", "CAP", "2ndPro", "1rePro"],
  isSingleStep: false,
  sections: ["Fractions"],
  generator: (nb: number) => getDistinctQuestions(getFractionAndIntegerSum, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
