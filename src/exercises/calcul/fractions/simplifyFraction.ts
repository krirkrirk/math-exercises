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
import {
  Rational,
  RationalConstructor,
} from "#root/math/numbers/rationals/rational";
import { shuffle } from "#root/utils/shuffle";

type QCMProps = {
  answer: string;
};
type VEAProps = {
  num: number;
  denum: number;
};
const getSimplifyFraction: QuestionGenerator<QCMProps, VEAProps> = () => {
  const rational = RationalConstructor.randomSimplifiable(10);
  const rationalTex = rational.toTree().toTex();
  const answer = rational.simplify().toTree().toTex();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Simplifier : $${rationalTex}$`,
    startStatement: rationalTex,
    answer,
    keys: [],
    answerFormat: "tex",
    qcmGeneratorProps: { answer },
    veaProps: { num: rational.num, denum: rational.denum },
  };
  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
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
const isAnswerValid: VEA<VEAProps> = (ans, { num, denum }) => {
  const rational = new Rational(num, denum);

  const answerTree = rational
    .simplify()
    .toTree({ allowFractionToDecimal: true });

  const texs = answerTree.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const simplifyFraction: MathExercise<QCMProps, VEAProps> = {
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
};
