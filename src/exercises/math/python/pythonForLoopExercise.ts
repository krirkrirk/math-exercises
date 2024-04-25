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

const types = ["5", "6"];

const getPythonForLoopExerciseQuestion: QuestionGenerator<Identifiers> = () => {
  const exercise = generateRandomExercise();

  const correctAnswer = getCorrectAnswer(exercise.exoVariable);

  const question: Question<Identifiers> = {
    answer: correctAnswer.simplify().toTex(),
    instruction: exercise.instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { exercise: exercise.exoVariable },
  };

  return question;
};

const generateRandomExercise = (): PyExercise => {
  let exercise: PyExercise = {
    instruction: "",
    exoVariable: {
      a: 1,
      nbIteration: 1,
      op: "+",
      b: 2,
    },
  };
  const randType = types[randint(0, types.length)];
  switch (randType) {
    case "5":
      exercise = generateType5Exercise();
      break;
    case "6":
      exercise = generateType6Exercise();
      break;
  }
  return exercise;
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
    let correctAnswer = getCorrectAnswer(exercise).value;
    let random = new NumberNode(
      randint(correctAnswer - 15, correctAnswer + 16, [correctAnswer]),
    );
    tryToAddWrongProp(propositions, random.simplify().toTex());
  }
  return shuffleProps(propositions, n);
};

const generatePropostion = (exercise: PyExoVariables): string[] => {
  let propositions: string[] = [];
  switch (typeof exercise.b) {
    case "undefined":
      propositions = generateType5Proposition(
        exercise.a,
        exercise.op,
        exercise.nbIteration,
      );
      break;
    case "number":
      const b = exercise.b as number;
      propositions = generateType6Proposition(
        exercise.a,
        b,
        exercise.nbIteration,
      );
      break;
  }
  return propositions;
};

const generateType5Exercise = (): PyExercise => {
  const a = randint(-10, 11);
  const operands = ["+", "-"];
  const nbIterations = [1000, 100, 10];

  const nbIteration = nbIterations[randint(0, nbIterations.length)];
  let op = operands[randint(0, operands.length)];
  const exoVariable = {
    a,
    nbIteration,
    op,
  };
  const instruction = `Qu’affichera le programme suivant ?
  \`\`\`\
  exercise
  a=${a}
  for i in range (1,${nbIteration + 1}):
      a=a${op}0.05
  print(a)
  \`\`\`\
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
  \`\`\`\
  test
  b=${b}
  a=int(input("Entrez un nombre"))
  for i in range(1,${nbIteration + 1}):
      b=b*a  
  print(a)
  \`\`\`\
  `;
  return { instruction, exoVariable };
};
const generateType5Proposition = (
  a: number,
  op: string,
  nbIteration: number,
): string[] => {
  let firstPropostion = new AddNode(
    getType5CorrectAnswer(a, op, nbIteration),
    new Rational(1, 2).toTree(),
  );
  let secondProposition = new AddNode(
    getType5CorrectAnswer(a, op, nbIteration),
    new Rational(-1, 2).toTree(),
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
    secondProposition.simplify().toTex(),
    thirdProposition.simplify().toTex(),
  ];
};

const getCorrectAnswer = (exercise: PyExoVariables): NumberNode => {
  switch (typeof exercise.b) {
    case "undefined":
      return getType5CorrectAnswer(
        exercise.a,
        exercise.op,
        exercise.nbIteration,
      );
      break;
    case "number":
      let b = exercise.b as number;
      return getType6CorrectAnswer(exercise.a, b, exercise.nbIteration);
      break;
  }
  return new NumberNode(1);
};

const getType5CorrectAnswer = (
  a: number,
  op: string,
  nbIteration: number,
): NumberNode => {
  const multiplied = nbIteration * 0.5;
  switch (op) {
    case "+":
      return new NumberNode(a + multiplied);
    case "-":
      return new NumberNode(a - multiplied);
  }
  return new NumberNode(1);
};

const getType6CorrectAnswer = (
  a: number,
  b: number,
  nbIteration: number,
): NumberNode => {
  const multiplier = Math.pow(a, nbIteration);
  return new NumberNode(multiplier * b);
};
const isAnswerValid: VEA<Identifiers> = (ans, { exercise }) => {
  return getCorrectAnswer(exercise).toAllValidTexs().includes(ans);
};
export const pythonForLoopExercise: Exercise<Identifiers> = {
  id: "pythonForLoopExercise",
  label: "Exercice python sur les boucle for",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Python"],
  generator: (nb: number) =>
    getDistinctQuestions(getPythonForLoopExerciseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
