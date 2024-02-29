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
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { shuffle } from "#root/utils/shuffle";

const getFractionAndIntegerProduct: QuestionGenerator<Identifiers> = () => {
  const rational = RationalConstructor.randomIrreductible();
  const integer = new Integer(randint(-10, 11, [0, 1]));
  const statementTree = new MultiplyNode(rational.toTree(), integer.toTree());
  statementTree.shuffle();

  const answerTree = rational.multiply(integer).toTree();
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
  const integerObj = new Integer(integer);
  const rationalObj = new Rational(rational[0], rational[1]);
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new Rational(
      integerObj.value * rationalObj.num,
      integerObj.value * rationalObj.denum,
    ).toTex(),
  );

  while (propositions.length < n) {
    const randomMultiplier = randint(-10, 10);
    const wrongAnswerTree = rationalObj
      .multiply(new Integer(randomMultiplier))
      .toTree();
    tryToAddWrongProp(propositions, wrongAnswerTree.toTex());
  }
  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { integer, rational }) => {
  const integerObj = new Integer(integer);
  const rationalObj = new Rational(rational[0], rational[1]);
  const answerTree = rationalObj
    .multiply(integerObj)
    .toTree({ allowFractionToDecimal: true });
  const texs = answerTree.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const fractionAndIntegerProduct: MathExercise<Identifiers> = {
  id: "fractionAndIntegerProduct",
  connector: "=",
  label: "Produit d'un entier et d'une fraction",
  levels: ["4ème", "3ème", "2nde", "CAP", "2ndPro", "1rePro"],
  isSingleStep: false,
  sections: ["Fractions"],
  generator: (nb: number) =>
    getDistinctQuestions(getFractionAndIntegerProduct, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
