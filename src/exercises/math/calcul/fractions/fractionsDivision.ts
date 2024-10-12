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
import { DivideNode } from "#root/tree/nodes/operators/divideNode";
import { shuffle } from "#root/utils/alea/shuffle";

const getFractionsDivision: QuestionGenerator<Identifiers> = () => {
  const rational = RationalConstructor.randomIrreductible();
  const rational2 = RationalConstructor.randomIrreductible();
  const statementTree = new DivideNode(rational.toTree(), rational2.toTree());
  const answerTree = rational.divide(rational2).toTree();
  const answer = answerTree.toTex();
  const beforeSimplification = new Rational(
    rational.num * rational2.denum,
    rational.denum * rational2.num,
  );
  const isSimplifiable = !beforeSimplification.isIrreductible();
  const question: Question<Identifiers> = {
    instruction: `Calculer et donner le résultat sous la forme d'une fraction irréductible : $${statementTree.toTex()}$`,
    startStatement: statementTree.toTex(),
    answer,
    keys: [],
    answerFormat: "tex",
    hint: "Pour diviser par une fraction, il faut multiplier la première fraction par l'inverse de la deuxième. Simplifie ensuite la fraction obtenue si nécessaire.",
    correction: `On multiplie la première fraction par l'inverse de la deuxième : 

$$
${statementTree.toTex()} = ${rational.toTree().toTex()}\\times ${rational2
      .reverse(false)
      .toTree()
      .toTex()}
$$

Multiplions les fractions : 

$$
\\frac{${rational.num}\\times${rational2.denum}}{${rational.denum}\\times${
      rational2.num
    }} = ${beforeSimplification.toTree().toTex()}
$$

${
  isSimplifiable
    ? `On peut alors simplifier cette fraction : 
    
$$
${beforeSimplification.toTree().toTex()} = ${answer}
$$`
    : "Cette fraction est déjà sous forme irréductible."
}

Ainsi, le résultat attendu est $${answer}$.
    `,
    identifiers: {
      rationalNum: [rational.num, rational.denum],
      rationalDenum: [rational2.num, rational2.denum],
    },
  };
  return question;
};

type Identifiers = {
  rationalNum: [number, number];
  rationalDenum: [number, number];
};

const getPropositions: QCMGenerator<Identifiers> = (
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

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { rationalDenum, rationalNum },
) => {
  const rational = new Rational(rationalNum[0], rationalNum[1]);
  const rational2 = new Rational(rationalDenum[0], rationalDenum[1]);
  const answerTree = rational
    .divide(rational2)
    .toTree({ allowFractionToDecimal: true });

  const texs = answerTree.toAllValidTexs();
  return texs.includes(ans);
};

export const fractionsDivision: Exercise<Identifiers> = {
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
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
