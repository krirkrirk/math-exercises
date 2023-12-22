import {
  SquareRoot,
  SquareRootConstructor,
} from "#root/math/numbers/reals/real";
import { shuffle } from "#root/utils/shuffle";
import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../exercise";
import { getDistinctQuestions } from "../utils/getDistinctQuestions";
type QCMProps = {
  answer: string;
};
type VEAProps = {
  sqrtOperand: number;
};

const getSimplifySquareRoot: QuestionGenerator<QCMProps, VEAProps> = () => {
  const squareRoot = SquareRootConstructor.randomSimplifiable({
    allowPerfectSquare: false,
    maxSquare: 11,
  });

  const sqrtTex = squareRoot.toTree().toTex();
  const answer = squareRoot.simplify().toTree().toTex();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Simplifier : $${sqrtTex}$`,
    startStatement: sqrtTex,
    answer,
    keys: [],
    answerFormat: "tex",
    qcmGeneratorProps: { answer },
    veaProps: { sqrtOperand: squareRoot.operand },
  };
  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const squareRoot = SquareRootConstructor.randomSimplifiable({
      allowPerfectSquare: false,
      maxSquare: 11,
    });
    tryToAddWrongProp(propositions, squareRoot.simplify().toTree().toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<VEAProps> = (ans, { sqrtOperand }) => {
  const answer = new SquareRoot(sqrtOperand).simplify().toTree();
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const simplifySquareRoot: MathExercise<QCMProps, VEAProps> = {
  id: "simplifySqrt",
  connector: "=",
  label: "Simplification de racines carrées",
  isSingleStep: false,
  levels: ["3ème", "2nde", "1reESM"],
  sections: ["Racines carrées"],
  generator: (nb: number) => getDistinctQuestions(getSimplifySquareRoot, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
