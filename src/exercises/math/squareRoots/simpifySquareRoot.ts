import {
  SquareRoot,
  SquareRootConstructor,
} from "#root/math/numbers/reals/real";
import { shuffle } from "#root/utils/shuffle";
import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";
type Identifiers = {
  sqrtOperand: number;
};

const getSimplifySquareRoot: QuestionGenerator<Identifiers> = () => {
  const squareRoot = SquareRootConstructor.randomSimplifiable({
    allowPerfectSquare: false,
    maxSquare: 11,
  });

  const sqrtTex = squareRoot.toTree().toTex();
  const answer = squareRoot.simplify().toTree().toTex();
  const question: Question<Identifiers> = {
    instruction: `Simplifier : $${sqrtTex}$`,
    startStatement: sqrtTex,
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: { sqrtOperand: squareRoot.operand },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
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

const isAnswerValid: VEA<Identifiers> = (ans, { sqrtOperand }) => {
  const answer = new SquareRoot(sqrtOperand).simplify().toTree();
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const simplifySquareRoot: Exercise<Identifiers> = {
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
  subject: "Mathématiques",
};
