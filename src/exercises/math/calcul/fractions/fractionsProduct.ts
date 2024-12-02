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
import {
  Rational,
  RationalConstructor,
} from "#root/math/numbers/rationals/rational";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { rationalParser } from "#root/tree/parsers/rationalParser";
import { shuffle } from "#root/utils/alea/shuffle";
import { v4 } from "uuid";

type Identifiers = {
  rationalNum: [number, number];
  rationalDenum: [number, number];
};

type Options = {
  allowNonIrreductible?: boolean;
};

const getFractionsProduct: QuestionGenerator<Identifiers, Options> = (opts) => {
  const rational = RationalConstructor.randomIrreductible();
  const rational2 = RationalConstructor.randomIrreductible();
  const statementTree = new MultiplyNode(rational.toTree(), rational2.toTree());
  const answerTree = rational.multiply(rational2).toTree();
  const answer = answerTree.toTex();
  const beforeSimplification = new Rational(
    rational.num * rational2.num,
    rational.denum * rational2.denum,
  );
  const question: Question<Identifiers, Options> = {
    instruction: `Calculer ${
      opts?.allowNonIrreductible
        ? ""
        : "et donner le résultat sous la forme la plus simplifiée possible"
    } : 
    
$$
${statementTree.toTex()}
$$`,
    startStatement: statementTree.toTex(),
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      rationalNum: [rational.num, rational.denum],
      rationalDenum: [rational2.num, rational2.denum],
    },
    hint: "Pour multiplier deux fractions, on multiplie les numérateurs entre eux et les dénominateurs entre eux, puis on simplifie la fraction obtenue si nécessaire.",
    correction: `On multiplie les numérateurs entre eux et les dénominateurs entre eux :  

$$
\\frac{${rational.num}\\times${rational2.num}}{${rational.denum}\\times${
      rational2.denum
    }} = ${beforeSimplification.toTree().toTex()}
$$

${
  !beforeSimplification.isIrreductible()
    ? `On peut alors simplifier cette fraction : 
    
$$
${beforeSimplification.toTree().toTex()} = ${answer}
$$`
    : "Cette fraction est déjà simplifiée."
}

Ainsi, le résultat attendu est $${answer}$.
    `,
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, rationalNum, rationalDenum },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const rational2 = new Rational(rationalDenum[0], rationalDenum[1]);
  while (propositions.length < n) {
    const randomRational = RationalConstructor.randomIrreductible();
    const wrongAnswerTree = randomRational.multiply(rational2).toTree();
    tryToAddWrongProp(propositions, wrongAnswerTree.toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers, Options> = (
  ans,
  { rationalDenum, rationalNum },
  opts,
) => {
  const rational = new Rational(rationalNum[0], rationalNum[1]);
  const rational2 = new Rational(rationalDenum[0], rationalDenum[1]);
  const answerTree = rational
    .multiply(rational2)
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

const options = [allowNonIrreductibleOption];

export const fractionsProduct: Exercise<Identifiers, Options> = {
  id: "fractionsProduct",
  connector: "=",
  label: "Produits de fractions",
  levels: ["4ème", "3ème", "2nde", "CAP", "2ndPro", "1rePro"],
  sections: ["Fractions"],
  isSingleStep: false,
  generator: (nb, opts) =>
    getDistinctQuestions(() => getFractionsProduct(opts), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
  options,
};
