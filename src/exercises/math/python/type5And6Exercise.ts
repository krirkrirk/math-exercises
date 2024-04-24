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
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";

type Identifiers = {
  exercise: pyExercise;
};

type pyExercise = {
  instruction: string;
  type: string;
  op: string;
  nbIteration: number;
  a: number;
  b?: number;
};

const types = ["5", "6"];

const getType5And6ExerciseQuestion: QuestionGenerator<Identifiers> = () => {
  const exercise = generateRandomExercise();
  const correctAnswer = getCorrectAnswer(exercise);

  const question: Question<Identifiers> = {
    answer: correctAnswer.simplify().toTex(),
    instruction: exercise.instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { exercise },
  };

  return question;
};

const generateRandomExercise = (): pyExercise => {
  let exercise: pyExercise = {
    instruction: "",
    type: "",
    op: "+",
    nbIteration: 1,
    b: 1,
    a: 1,
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
    let bRand = exercise.b
      ? randint(exercise.b - 3, exercise.b + 4, [exercise.b])
      : undefined;
    let aRand = randint(exercise.a - 3, exercise.a + 4, [exercise.a]);
    let exo = { ...exercise, a: aRand, b: bRand };
    generatePropostion(exo).forEach((value) =>
      tryToAddWrongProp(propositions, value),
    );
  }
  return shuffleProps(propositions, n);
};

const generatePropostion = (exercise: pyExercise): string[] => {
  let propositions: string[] = [];
  switch (exercise.type) {
    case "5":
      propositions = generateType5Proposition(
        exercise.a,
        exercise.op,
        exercise.nbIteration,
      );
      break;
    case "6":
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

const generateType5Exercise = (): pyExercise => {
  const a = randint(-10, 11);
  const operands = ["+", "-"];
  const nbIterations = [1000, 100, 10];

  const nbIteration = nbIterations[randint(0, nbIterations.length)];
  let op = operands[randint(0, operands.length)];
  const instruction = `Qu’affichera le programme suivant ?
  \`\`\`\
  exercise
  a=${a}
  for i in range (1,${nbIteration + 1}):
      a=a${op}0.05
  print(a)
  \`\`\`\
  `;
  return { instruction, type: "5", op, nbIteration: nbIteration, a };
};

const generateType6Exercise = (): pyExercise => {
  const a = randint(-4, 5, [0]);
  const b = randint(1, 4);
  const nbIteration = randint(3, 7);
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
  return { instruction, type: "6", op: "*", nbIteration, a, b };
};
const generateType5Proposition = (
  a: number,
  op: string,
  nbIteration: number,
): string[] => {
  let firstPropostion = new AddNode(
    getType5CorrectAnswer(a, op, nbIteration),
    new NumberNode(1),
  );
  let secondProposition = new AddNode(
    getType5CorrectAnswer(a, op, nbIteration),
    new NumberNode(-1),
  );
  return [
    firstPropostion.simplify().toTex(),
    secondProposition.simplify().toTex(),
  ];
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

const getCorrectAnswer = (exercise: pyExercise): NumberNode => {
  switch (exercise.type) {
    case "5":
      return getType5CorrectAnswer(
        exercise.a,
        exercise.op,
        exercise.nbIteration,
      );
      break;
    case "6":
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
      return new NumberNode(a + multiplied);
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
export const type5And6Exercice: Exercise<Identifiers> = {
  id: "type5And6Exercice",
  label: "Exercice python sur les boucle for",
  levels: ["2nde"],
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
