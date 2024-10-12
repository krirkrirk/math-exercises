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
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import {
  Rational,
  RationalConstructor,
} from "#root/math/numbers/rationals/rational";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  rational: [number, number];
  rational2: [number, number];
};

const getFractionsSum: QuestionGenerator<Identifiers> = () => {
  const rational = RationalConstructor.randomIrreductible();
  const rational2 = RationalConstructor.randomIrreductible();
  const statementTree = new AddNode(rational.toTree(), rational2.toTree());
  const answerTree = rational.add(rational2).toTree();
  const answer = answerTree.toTex();
  const question: Question<Identifiers> = {
    instruction: `Calculer et donner le résultat sous la forme d'une fraction irréductible : $${statementTree.toTex()}$`,
    startStatement: statementTree.toTex(),
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      rational: [rational.num, rational.denum],
      rational2: [rational2.num, rational2.denum],
    },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, rational, rational2 },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new Rational(
      rational[0] + rational2[0],
      rational[1] + rational2[1],
    ).toTex(),
  );

  while (propositions.length < n) {
    const incorrectRational = RationalConstructor.randomIrreductible();
    const incorrectRational2 = RationalConstructor.randomIrreductible();
    tryToAddWrongProp(
      propositions,
      incorrectRational.add(incorrectRational2).toTree().toTex(),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { rational, rational2 }) => {
  const rationalA = new Rational(rational[0], rational[1]);
  const rationalB = new Rational(rational2[0], rational2[1]);

  const answerTree = rationalA
    .add(rationalB)
    .toTree({ allowFractionToDecimal: true });

  const texs = answerTree.toAllValidTexs();
  return texs.includes(ans);
};

export const fractionsSum: Exercise<Identifiers> = {
  id: "fractionsSum",
  connector: "=",
  label: "Sommes de fractions",
  levels: ["4ème", "3ème", "2nde", "CAP", "2ndPro", "1rePro"],
  sections: ["Fractions"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFractionsSum, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
