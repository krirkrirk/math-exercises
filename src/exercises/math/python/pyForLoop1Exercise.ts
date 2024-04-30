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
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { coinFlip } from "#root/utils/coinFlip";
import { random } from "#root/utils/random";

type Identifiers = {
  exercise: PyExoVariables;
};

type PyExercise = {
  instruction: string;
  exoVariable: PyExoVariables;
};

type PyExoVariables = {
  a: number;
  nbIteration: number;
  op: string;
  b?: number;
};

const getPythonForLoop1ExerciseQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exercise = generateRandomExercise();

  const correctAnswer = getCorrectAnswer(exercise.exoVariable);

  const question: Question<Identifiers> = {
    answer: correctAnswer + "",
    instruction: exercise.instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { exercise: exercise.exoVariable },
  };

  return question;
};

const generateRandomExercise = (): PyExercise => {
  const isType5 = coinFlip();
  return isType5 ? generateType5Exercise() : generateType6Exercise();
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, exercise },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropostion(exercise).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );

  while (propositions.length < n) {
    let correctAnswer = getCorrectAnswer(exercise);
    let random = randint(correctAnswer - 15, correctAnswer + 16, [
      correctAnswer,
    ]);
    tryToAddWrongProp(propositions, random + "");
  }
  return shuffleProps(propositions, n);
};

const generatePropostion = (exercise: PyExoVariables): string[] => {
  if (exercise.b !== undefined) {
    return generateType6Proposition(
      exercise.a,
      exercise.b,
      exercise.nbIteration,
    );
  } else {
    return generateType5Proposition(
      exercise.a,
      exercise.op,
      exercise.nbIteration,
    );
  }
};

const generateType5Exercise = (): PyExercise => {
  const a = randint(-10, 11);
  const operands = ["+", "-"];
  const nbIterations = [1000, 100, 10];

  const nbIteration = random(nbIterations);
  let op = random(operands);
  const exoVariable = {
    a,
    nbIteration,
    op,
  };
  const instruction = `Qu’affichera le programme suivant ?
  \`\`\`
  a=${a}
  for i in range (1,${nbIteration + 1}):
      a=a${op}0.5
  print(a)
  \`\`\`
  `;
  return { instruction, exoVariable };
};

const generateType6Exercise = (): PyExercise => {
  const a = randint(-4, 4, [0]);
  const b = randint(1, 4);
  const nbIteration = randint(3, 6);

  const exoVariable = {
    a,
    nbIteration,
    op: "*",
    b,
  };
  const instruction = `Qu'affiche le programme suivant, si l'utilisateur entre $${a}$ ?
  \`\`\`
  b=${b}
  a=int(input("Entrez un nombre"))
  for i in range(1,${nbIteration + 1}):
      b=b*a  
  print(a)
  \`\`\`
  `;
  return { instruction, exoVariable };
};
const generateType5Proposition = (
  a: number,
  op: string,
  nbIteration: number,
): string[] => {
  let firstPropostion = new NumberNode(
    getType5CorrectAnswer(a, op, nbIteration) + 0.5,
  );

  let secondProposition = new NumberNode(
    getType5CorrectAnswer(a, op, nbIteration) - 0.5,
  );

  return [firstPropostion.toTex(), secondProposition.toTex()];
};

const generateType6Proposition = (
  a: number,
  b: number,
  nbIteration: number,
): string[] => {
  const aNode = new NumberNode(a);
  const bNode = new NumberNode(b);
  const firstPropostion = new MultiplyNode(bNode, aNode);
  const secondProposition = getType6CorrectAnswer(a, b, nbIteration + 1);
  const thirdProposition = getType6CorrectAnswer(a, b, nbIteration - 1);
  return [
    firstPropostion.simplify().toTex(),
    secondProposition + "",
    thirdProposition + "",
  ];
};

const getCorrectAnswer = (exercise: PyExoVariables): number => {
  if (exercise.b !== undefined) {
    return getType6CorrectAnswer(exercise.a, exercise.b, exercise.nbIteration);
  } else {
    return getType5CorrectAnswer(exercise.a, exercise.op, exercise.nbIteration);
  }
};

const getType5CorrectAnswer = (
  a: number,
  op: string,
  nbIteration: number,
): number => {
  const multiplied = nbIteration * 0.5;
  switch (op) {
    case "+":
      return a + multiplied;
    case "-":
      return a - multiplied;
  }
  return 1;
};

const getType6CorrectAnswer = (
  a: number,
  b: number,
  nbIteration: number,
): number => {
  const multiplier = Math.pow(a, nbIteration);
  return multiplier * b;
};
const isAnswerValid: VEA<Identifiers> = (ans, { exercise }) => {
  return getCorrectAnswer(exercise) + "" === ans;
};
export const pythonForLoop1Exercise: Exercise<Identifiers> = {
  id: "pyForLoop1Exercise",
  label: "Exercice python sur les boucle for 1",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Python"],
  generator: (nb: number) =>
    getDistinctQuestions(getPythonForLoop1ExerciseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
