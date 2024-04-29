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
import { random } from "#root/utils/random";

type Identifiers = {
  exercise: PyExoVariables;
};

type PyExercise = {
  instruction: string;
  exoVariables: PyExoVariables;
};

type PyExoVariables = {
  op: string;
  n: number;
  p: number;
};

const operators = ["+", "-"];

const getPyNestedForLoopExerciseQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exercise = generateExercise();
  const correctAnswer = getCorrectAnswer(exercise.exoVariables);
  const question: Question<Identifiers> = {
    answer: correctAnswer + "",
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
  generateProposition(exercise).forEach((value) =>
    tryToAddWrongProp(propositions, value + ""),
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      randint(+answer - 10, +answer + 11, [+answer]) + "",
    );
  }
  return shuffleProps(propositions, n);
};

const generateProposition = (exo: PyExoVariables): number[] => {
  const exoProposition = {
    op: exo.op,
    n: exo.n + 1,
    p: exo.p + 1,
  };
  const firstProposition = getCorrectAnswer(exoProposition);
  exoProposition.p = exo.p - 1;
  exoProposition.n = exo.n - 1;
  const secondProposition = getCorrectAnswer(exoProposition);
  const thridProposition = exo.op === "+" ? exo.n : -exo.n;
  return [firstProposition, secondProposition, thridProposition];
};

const isAnswerValid: VEA<Identifiers> = (ans, { exercise }) => {
  return getCorrectAnswer(exercise) + "" === ans;
};

const generateExercise = (): PyExercise => {
  const op = random(operators);
  const n = randint(2, 11);
  const p = randint(2, 11);

  const exoVariables = {
    op,
    n,
    p,
  };

  const instruction = `Qu’affichera le programme suivant ?
  \`\`\`
  s=0
  n=${n}
  p=${p}
  for i in range(1,n+1):
    for j in range(1,p+1):
      s=s${op}1
  print(s) 
  \`\`\`
  `;
  return { instruction, exoVariables };
};

const getCorrectAnswer = (exo: PyExoVariables): number => {
  const nbIteration = exo.p * exo.n;
  return exo.op == "+" ? nbIteration : -nbIteration;
};
export const pyNestedForLoopExercise: Exercise<Identifiers> = {
  id: "pyNestedForLoopExercise",
  label: "Exercise sur les boucles for imbriquée en python",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Python"],
  generator: (nb: number) =>
    getDistinctQuestions(getPyNestedForLoopExerciseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
