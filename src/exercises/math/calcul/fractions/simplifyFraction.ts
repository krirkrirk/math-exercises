import {
  Exercise,
  GetInstruction,
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
import { frac } from "#root/tree/nodes/operators/fractionNode";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  num: number;
  denum: number;
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const rational = frac(identifiers.num, identifiers.denum);
  return `Simplifier le plus possible : 
  
$$
${rational.toTex()}
$$`;
};

const getSimplifyFraction: QuestionGenerator<Identifiers> = () => {
  const rational = RationalConstructor.randomSimplifiable(10);
  const rationalTex = rational.toTree().toTex();
  const answer = rational.simplify().toTree().toTex();

  const identifiers = { num: rational.num, denum: rational.denum };
  const question: Question<Identifiers> = {
    instruction: getInstruction(identifiers),
    startStatement: rationalTex,
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers,
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const incorrectRational = RationalConstructor.randomSimplifiable(10);
    tryToAddWrongProp(
      propositions,
      incorrectRational.simplify().toTree().toTex(),
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { num, denum }) => {
  const rational = new Rational(num, denum);

  const answerTree = rational
    .simplify()
    .toTree({ allowFractionToDecimal: true });

  const texs = answerTree.toAllValidTexs();
  return texs.includes(ans);
};

export const simplifyFraction: Exercise<Identifiers> = {
  id: "simplifyFrac",
  connector: "=",
  label: "Simplification de fractions",
  levels: ["4ème", "3ème", "2nde", "CAP", "2ndPro", "1rePro"],
  sections: ["Fractions"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getSimplifyFraction, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
