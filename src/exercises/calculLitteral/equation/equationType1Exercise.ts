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
import { equationKeys } from "#root/exercises/utils/keys/equationKeys";
import { Affine } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { shuffle } from "#root/utils/shuffle";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { EqualNode } from "#root/tree/nodes/operators/equalNode";

/**
 *  type x+a=b
 */
type QCMProps = {
  answer: string;
  a: number;
  b: number;
};
type VEAProps = {
  a: number;
  b: number;
};

const getEquationType1ExerciseQuestion: QuestionGenerator<
  QCMProps,
  VEAProps
> = () => {
  const b = randint(-10, 11);
  const a = randint(-10, 11, [0]);
  const solution = b - a;
  const affine = new Affine(1, a).toTree();
  const tree = new EqualNode(affine, new NumberNode(b));
  const answer = `x=${solution}`;
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Résoudre : $${tree.toTex()}$`,
    startStatement: tree.toTex(),
    answer,
    keys: equationKeys,
    answerFormat: "tex",
    qcmGeneratorProps: { answer, a, b },
  };
  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const solution = b - a;
  tryToAddWrongProp(propositions, `x = ${b + a}`);

  while (propositions.length < n) {
    const wrongAnswer = solution + randint(-3, 4, [0]);

    tryToAddWrongProp(propositions, `x = ${wrongAnswer}`);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<VEAProps> = (ans, { a, b }) => {
  const solution = b - a;
  const answerTree = new EquationSolutionNode(
    new DiscreteSetNode([new NumberNode(solution)]),
  );
  const validLatexs = answerTree.toAllValidTexs();
  return validLatexs.includes(ans);
};

export const equationType1Exercise: MathExercise<QCMProps, VEAProps> = {
  id: "equa1",
  connector: "\\iff",
  label: "Équations $x+a = b$",
  levels: ["4ème", "3ème", "2nde", "CAP", "2ndPro", "1rePro", "1reTech"],
  sections: ["Équations"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getEquationType1ExerciseQuestion, nb),
  getPropositions,
  qcmTimer: 60,
  freeTimer: 60,
  isAnswerValid,
};
