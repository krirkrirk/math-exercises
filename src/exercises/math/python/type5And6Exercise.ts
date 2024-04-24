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
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";

type Identifiers = {
  a: number;
  op: string;
  type: string;
  b?: number;
};

type pyExercise = {
  instruction: string;
  type: string;
  a: number;
  op: string;
  b?: number;
};

const types = ["5", "6"];

const getType5And6ExerciseQuestion: QuestionGenerator<Identifiers> = () => {
  let exercise: pyExercise = { instruction: "", type: "", a: 1, op: "+", b: 1 };
  let correctAnswer: AlgebraicNode = new NumberNode(1);
  const randType = types[0];
  switch (randType) {
    case "5":
      exercise = generateType5Exercise();
      correctAnswer = getCorrectAnswer(randType, exercise.a, exercise.op);
      break;
    case "6":
      break;
  }
  const question: Question<Identifiers> = {
    answer: correctAnswer.simplify().toTex(),
    instruction: exercise.instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { a: exercise.a, op: exercise.op, type: randType },
  };

  return question;
};

const getCorrectAnswer = (
  type: string,
  a: number,
  op: string,
  b?: number,
): AlgebraicNode => {
  let correctAnswer: AlgebraicNode = new NumberNode(1);
  const aNode = new NumberNode(a);
  const nbIteration = new MultiplyNode(
    new NumberNode(0.5),
    new NumberNode(1000),
  );
  switch (type) {
    case "5":
      switch (op) {
        case "+":
          correctAnswer = new AddNode(aNode, nbIteration.simplify());
          break;
        case "-":
          correctAnswer = new SubstractNode(aNode, nbIteration.simplify());
          break;
      }
      break;
    case "6":
      break;
  }
  return correctAnswer;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, op, type, b },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropostion(type, a, op, b).forEach((value) =>
    tryToAddWrongProp(propositions, value.simplify().toTex()),
  );

  while (propositions.length < n) {
    generatePropostion(
      type,
      randint(a - 3, a + 4, [a]),
      op,
      b ? randint(b - 3, b + 4, [b]) : undefined,
    ).forEach((value) =>
      tryToAddWrongProp(propositions, value.simplify().toTex()),
    );
  }
  return shuffleProps(propositions, n);
};

const generatePropostion = (
  type: string,
  a: number,
  op: string,
  b?: number,
): AlgebraicNode[] => {
  let firstPropostion: AlgebraicNode = new NumberNode(1);
  let secondProposition: AlgebraicNode = new NumberNode(2);
  switch (type) {
    case "5":
      firstPropostion = new AddNode(
        getCorrectAnswer(type, a, op),
        new NumberNode(1),
      );
      secondProposition = new AddNode(
        getCorrectAnswer(type, a, op),
        new NumberNode(-1),
      );
      break;
    case "6":
      break;
  }
  return [firstPropostion, secondProposition];
};

const generateType5Exercise = (): pyExercise => {
  const a = randint(-10, 11);
  const operands = ["+", "-"];
  let op = operands[randint(0, operands.length)];
  const instruction = `\`\`\`\
  exercise
  a=${a}
  for i in range (1,1001):
      a=a${op}0.05
  print(a)
  \`\`\`\
  `;
  return { instruction, type: "5", a, op };
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, a, op, type }) => {
  return getCorrectAnswer(type, a, op)
    .simplify()
    .toAllValidTexs()
    .includes(ans);
};
export const type5And6Exercice: Exercise<Identifiers> = {
  id: "type5And6Exercice",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getType5And6ExerciseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
