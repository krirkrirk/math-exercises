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
  let exercise: pyExercise = {
    instruction: "",
    type: "",
    op: "+",
    nbIteration: 1,
    b: 1,
    a: 1,
  };
  let correctAnswer: AlgebraicNode = new NumberNode(1);
  const randType = types[1];
  switch (randType) {
    case "5":
      exercise = generateType5Exercise();
      correctAnswer = getCorrectAnswer(exercise);
      break;
    case "6":
      exercise = generateType6Exercise();
      correctAnswer = getCorrectAnswer(exercise);
      break;
  }
  const question: Question<Identifiers> = {
    answer: correctAnswer.simplify().toTex(),
    instruction: exercise.instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { exercise },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, exercise },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropostion(exercise).forEach((value) =>
    tryToAddWrongProp(propositions, value.simplify().toTex()),
  );

  while (propositions.length < n) {
    let bRand = exercise.b
      ? randint(exercise.b - 3, exercise.b + 4, [exercise.b])
      : undefined;
    let aRand = randint(exercise.a - 3, exercise.a + 4, [exercise.a]);
    let exo = { ...exercise, a: aRand, b: bRand };
    generatePropostion(exo).forEach((value) =>
      tryToAddWrongProp(propositions, value.simplify().toTex()),
    );
  }
  return shuffleProps(propositions, n);
};

const generatePropostion = (exercise: pyExercise): AlgebraicNode[] => {
  let propositions: AlgebraicNode[] = [];
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

const generateType5Proposition = (
  a: number,
  op: string,
  nbIteration: number,
): AlgebraicNode[] => {
  let firstPropostion = new AddNode(
    getType5CorrectAnswer(a, op, nbIteration),
    new NumberNode(1),
  );
  let secondProposition = new AddNode(
    getType5CorrectAnswer(a, op, nbIteration),
    new NumberNode(-1),
  );
  return [firstPropostion, secondProposition];
};

const generateType6Proposition = (
  a: number,
  b: number,
  nbIteration: number,
): AlgebraicNode[] => {
  const aNode = new NumberNode(a);
  const bNode = new NumberNode(b);
  const firstPropostion = new MultiplyNode(bNode, aNode);
  const secondProposition = getType6CorrectAnswer(a, b, nbIteration + 1);
  const thirdProposition = getType6CorrectAnswer(a, b, nbIteration - 1);
  return [firstPropostion, secondProposition, thirdProposition];
};

const generateType5Exercise = (): pyExercise => {
  const a = randint(-10, 11);
  const operands = ["+", "-"];
  const nbIterations = [1001, 101, 11];

  const nbIteration = nbIterations[randint(0, nbIterations.length)];
  let op = operands[randint(0, operands.length)];
  const instruction = `Qu’affichera le programme suivant ?
  \`\`\`\
  exercise
  a=${a}
  for i in range (1,${nbIteration}):
      a=a${op}0.05
  print(a)
  \`\`\`\
  `;
  return { instruction, type: "5", op, nbIteration: nbIteration - 1, a };
};

const generateType6Exercise = (): pyExercise => {
  const a = randint(-10, 11);
  const b = randint(1, 4);
  const nbIteration = randint(1, 7);
  const instruction = `Qu'affiche le programme suivant si l'utilisateur entre $${a}$ ?
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

const getCorrectAnswer = (exercise: pyExercise): AlgebraicNode => {
  let correctAnswer: AlgebraicNode = new NumberNode(1);
  switch (exercise.type) {
    case "5":
      correctAnswer = getType5CorrectAnswer(
        exercise.a,
        exercise.op,
        exercise.nbIteration,
      );
      break;
    case "6":
      let b = exercise.b as number;
      correctAnswer = getType6CorrectAnswer(
        exercise.a,
        b,
        exercise.nbIteration,
      );
      break;
  }
  return correctAnswer;
};

const getType5CorrectAnswer = (
  a: number,
  op: string,
  nbIteration: number,
): AlgebraicNode => {
  let correctAnswer: AlgebraicNode = new NumberNode(1);
  const multiplied = new MultiplyNode(
    new NumberNode(0.5),
    new NumberNode(nbIteration),
  );
  const aNode = new NumberNode(a);
  switch (op) {
    case "+":
      correctAnswer = new AddNode(aNode, multiplied.simplify());
      break;
    case "-":
      correctAnswer = new SubstractNode(aNode, multiplied.simplify());
      break;
  }
  return correctAnswer;
};

const getType6CorrectAnswer = (
  a: number,
  b: number,
  nbIteration: number,
): AlgebraicNode => {
  const aNode = new NumberNode(a);
  const bNode = new NumberNode(b);
  const result = new MultiplyNode(
    bNode,
    new MultiplyNode(aNode, new NumberNode(nbIteration)),
  );
  return result;
};
const isAnswerValid: VEA<Identifiers> = (ans, { exercise }) => {
  return getCorrectAnswer(exercise).simplify().toAllValidTexs().includes(ans);
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
