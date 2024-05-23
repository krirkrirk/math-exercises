import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { coinFlip } from "#root/utils/coinFlip";
import { random } from "#root/utils/random";

type Identifiers = {};
const x = new VariableNode("x");

const getEquationWithOneUnknownExerciseQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exercise = generateExercise();
  const solution = exercise.solution;
  const equation = exercise.equation;
  const answer = exercise.answer;

  const instruction = `Soit l'equation $${equation.toTex()}$. La solution $${solution.toTex()}$ est-elle correct ?`;

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: instruction,
    keys: [],
    answerFormat: "raw",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Oui.", "raw");
  tryToAddWrongProp(propositions, "Non.", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir.", "raw");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generateExercise = (): {
  equation: EqualNode;
  solution: EqualNode;
  answer: string;
} => {
  const a = randint(-11, 10, [0]);
  const b = randint(-11, 10);
  const result = randint(-100, 101);
  const aNode = new NumberNode(a);
  const bNode = new NumberNode(b);
  const resultNode = new NumberNode(result);
  const equation = new EqualNode(
    new AddNode(new MultiplyNode(aNode, x).simplify(), bNode).simplify(),
    resultNode,
  );
  const flip = coinFlip();
  if (flip) {
    const solution = new EqualNode(
      x,
      new FractionNode(
        new SubstractNode(resultNode, bNode).simplify(),
        aNode,
      ).simplify(),
    );
    return { equation, solution, answer: "Oui." };
  } else {
    const solution = random(generateFalseSolutions(aNode, bNode, resultNode));
    return { equation, solution, answer: "Non." };
  }
};

const generateFalseSolutions = (
  a: NumberNode,
  b: NumberNode,
  result: NumberNode,
): EqualNode[] => {
  const firstProposition = new EqualNode(
    x,
    new FractionNode(new AddNode(result, b).simplify(), a).simplify(),
  );

  const secondProposition = new EqualNode(
    x,
    new MultiplyNode(new SubstractNode(result, b).simplify(), a).simplify(),
  );

  const thidPropositon = new EqualNode(
    x,
    new MultiplyNode(new SubstractNode(result, b).simplify(), a).simplify(),
  );

  return [firstProposition, secondProposition, thidPropositon];
};

export const equationWithOneUnknownExercise: Exercise<Identifiers> = {
  id: "equationWithOneUnknownExercise",
  label: "Equation à une inconnue",
  levels: ["3ème"],
  isSingleStep: true,
  sections: ["Arithmétique"],
  generator: (nb: number) =>
    getDistinctQuestions(getEquationWithOneUnknownExerciseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  answerType: "QCM",
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
