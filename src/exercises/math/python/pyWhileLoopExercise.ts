import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { OperatorNode } from "#root/tree/nodes/operators/operatorNode";
import { PowerNode, SquareNode } from "#root/tree/nodes/operators/powerNode";

type Identifiers = {
  exercise: PyExoVariables;
};

type PyExercise = {
  instruction: string;
  exoVariables: PyExoVariables;
};

type PyExoVariables = {
  a: number;
  n: number;
  op: string;
};

const exoTypes = ["16", "17"];
const operators = ["+", "*"];

const getPyWhileLoopExerciseQuestion: QuestionGenerator<Identifiers> = () => {
  const exercise = generateRandomExercise();
  const correctAnswer = getCorrectAnswer(exercise.exoVariables);

  const question: Question<Identifiers> = {
    answer: correctAnswer.simplify().toTex(),
    instruction: exercise.instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { exercise: exercise.exoVariables },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { exercise }) => {
  const correctAnswer = getCorrectAnswer(exercise);
  return correctAnswer.simplify().toAllValidTexs().includes(ans);
};

const getCorrectAnswer = (exercise: PyExoVariables): NumberNode => {
  const nbIteration = exercise.a - exercise.n + 1;
  switch (exercise.op) {
    case "*":
      return new NumberNode(
        exercise.n * Math.pow(2, Math.ceil(Math.log2(nbIteration))),
      );
    case "+":
      return new NumberNode(exercise.n + 2 * Math.ceil(nbIteration / 2));
  }
  return new NumberNode(exercise.n);
};

const generateRandomExercise = (): PyExercise => {
  const a = randint(20, 61);
  const n = 1;
  const op = operators[randint(0, operators.length)];

  const randomType = exoTypes[randint(0, exoTypes.length)];
  const instruction = generateInstruction(randomType, a, n, op);

  return { instruction, exoVariables: { a, n, op } };
};

const generateInstruction = (
  exoType: string,
  a: number,
  n: number,
  op: string,
): string => {
  switch (exoType) {
    case "16":
      return generateType16Instruction(a, n, op);
    case "17":
      return generateType17Instruction(a, n, op);
  }
  return "";
};

const generateType16Instruction = (
  a: number,
  n: number,
  op: string,
): string => {
  const instruction = `Qu’affichera le programme suivant ?
  \`\`\`\
  test
  a=${a}
  n=${n}
  while n<=a:
    n=2${op}n
  print(n) 
  \`\`\`
  `;
  return instruction;
};

const generateType17Instruction = (
  a: number,
  n: number,
  op: string,
): string => {
  const instruction = `Qu’affichera le programme suivant, si l'utilisateur entre ${a}
  \`\`\`\
  test
  a=input("Entrez un entiel naturel non nul.")
  a=int(a)
  n=${n}
  while n<=a:
    n=2${op}n
  print(n) 
  \`\`\`
  `;
  return instruction;
};
export const pyWhileLoopExercise: Exercise<Identifiers> = {
  id: "pyWhileLoopExercise",
  label: "Exercise sur les boules while en python",
  levels: ["2nde"],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getPyWhileLoopExerciseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
