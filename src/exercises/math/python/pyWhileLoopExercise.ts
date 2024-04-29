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
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { random } from "#root/utils/random";

type Identifiers = {
  exercise: PyExoVariables;
};

type PyExercise = {
  instruction: string;
  exoVariables: PyExoVariables;
};

type PyExoVariables = {
  a: number;
  b: number;
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

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, exercise },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generateProposition(answer, exercise).forEach((value) =>
    tryToAddWrongProp(propositions, value.simplify().toTex()),
  );
  const correctAnswer = getCorrectAnswer(exercise).value;
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      randint(correctAnswer - 11, correctAnswer + 11, [correctAnswer]) + "",
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { exercise }) => {
  const correctAnswer = getCorrectAnswer(exercise);
  return correctAnswer.simplify().toAllValidTexs().includes(ans);
};

const generateProposition = (
  answer: string,
  exercise: PyExoVariables,
): NumberNode[] => {
  const firstProposition =
    exercise.op === "*" ? +answer * exercise.b : +answer + exercise.b;
  const secondProposition =
    exercise.op === "*" ? +answer / exercise.b : +answer - exercise.b;
  return [new NumberNode(firstProposition), new NumberNode(secondProposition)];
};

const getCorrectAnswer = (exercise: PyExoVariables): NumberNode => {
  switch (exercise.op) {
    case "*":
      return new NumberNode(
        Math.pow(
          exercise.b,
          Math.ceil(Math.log(exercise.a) / Math.log(exercise.b)),
        ),
      );
    case "+":
      return new NumberNode(
        1 + exercise.b * Math.ceil(exercise.a / exercise.b),
      );
  }
  return new NumberNode(exercise.b);
};

const generateRandomExercise = (): PyExercise => {
  const combination = {
    times: [
      { minB: 2, maxB: 2, maxIter: 10 },
      { minB: 3, maxB: 5, maxIter: 5 },
    ],
    plus: [{ minB: 2, maxB: 8, maxIter: 10 }],
  };
  const op = random(operators);
  const randCombination =
    op === "*" ? random(combination.times) : combination.plus[0];

  const b = randint(randCombination.minB, randCombination.maxB + 1);
  const nbIter = randint(2, randCombination.maxIter + 1);

  const aA = op === "+" ? Math.ceil(b * nbIter) : Math.pow(b, nbIter);
  const a = randint(aA / b, aA);

  const randomType = random(exoTypes);
  const instruction = generateInstruction(randomType, a, b, op);

  return { instruction, exoVariables: { a, b, op } };
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
  b: number,
  op: string,
): string => {
  const instruction = `Qu’affichera le programme suivant ?\n
  \`\`\`
  a=${a}
  n=1
  while n<=a:
    n=${b}${op}n
  print(n)
  \`\`\`
  `;
  return instruction;
};

const generateType17Instruction = (
  a: number,
  b: number,
  op: string,
): string => {
  const instruction = `Qu’affichera le programme suivant, si l'utilisateur entre ${a} ?\n
  \`\`\`
  a=input("Entrez un entiel naturel non nul.")
  a=int(a)
  n=1
  while n<=a:
    n=${b}${op}n
  print(n) 
  \`\`\`
  `;
  return instruction;
};

export const pyWhileLoopExercise: Exercise<Identifiers> = {
  id: "pyWhileLoopExercise",
  label: "Exercise sur les boules while 1 en python",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Python"],
  generator: (nb: number) =>
    getDistinctQuestions(getPyWhileLoopExerciseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
