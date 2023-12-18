import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import {
  Rational,
  RationalConstructor,
} from "#root/math/numbers/rationals/rational";
import { DivideNode } from "#root/tree/nodes/operators/divideNode";
import { shuffle } from "#root/utils/shuffle";

const getFractionsDivision: QuestionGenerator<QCMProps, VEAProps> = () => {
  const rational = RationalConstructor.randomIrreductible();
  const rational2 = RationalConstructor.randomIrreductible();
  const statementTree = new DivideNode(rational.toTree(), rational2.toTree());
  const answerTree = rational.divide(rational2).toTree();
  const answer = answerTree.toTex();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Calculer et donner le résultat sous la forme d'une fraction irréductible : $${statementTree.toTex()}$`,
    startStatement: statementTree.toTex(),
    answer,
    keys: [],
    answerFormat: "tex",
    qcmGeneratorProps: {
      answer,
      rationalNum: [rational.num, rational.denum],
      rationalDenum: [rational2.num, rational2.denum],
    },
  };
  return question;
};

type QCMProps = {
  answer: string;
  rationalNum: [number, number];
  rationalDenum: [number, number];
};
type VEAProps = {};
const getPropositions: QCMGenerator<QCMProps> = (
  n,
  { answer, rationalNum, rationalDenum },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const rational = new Rational(rationalNum[0], rationalNum[1]);
  const rational2 = new Rational(rationalDenum[0], rationalDenum[1]);

  tryToAddWrongProp(
    propositions,
    rational.multiply(rational2).toTree().toTex(),
  );

  while (propositions.length < n) {
    const randomRational = RationalConstructor.randomIrreductible();
    const wrongAnswerTree = randomRational.divide(rational2).toTree();
    tryToAddWrongProp(propositions, wrongAnswerTree.toTex());
  }

  return shuffle(propositions);
};

export const fractionsDivision: MathExercise<QCMProps, VEAProps> = {
  id: "fractionsDivision",
  connector: "=",
  label: "Divisions de fractions",
  levels: ["4ème", "3ème", "2nde", "CAP", "2ndPro", "1rePro"],
  sections: ["Fractions"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFractionsDivision, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
