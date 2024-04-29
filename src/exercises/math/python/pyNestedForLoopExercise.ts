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
  op: string;
  n: number;
  p: number;
  s: number;
  k: number;
};

enum DifficultyEnum {
  MEDIUM,
  HARD,
}

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
      randint(+answer - 10, +answer + 10, [+answer]) + "",
    );
  }
  return shuffleProps(propositions, n);
};

const generateProposition = (exo: PyExoVariables): number[] => {
  const exoProposition = {
    op: exo.op,
    n: exo.n + 1,
    p: exo.p + 1,
    s: exo.s,
    k: exo.k,
  };
  const firstProposition = getCorrectAnswer(exoProposition);
  exoProposition.p = exo.p - 1;
  exoProposition.n = exo.n - 1;
  const secondProposition = getCorrectAnswer(exoProposition);
  const thridProposition = exo.n * exo.k;
  return [firstProposition, secondProposition, thridProposition];
};

const isAnswerValid: VEA<Identifiers> = (ans, { exercise }) => {
  return getCorrectAnswer(exercise) + "" === ans;
};

const generateExercise = (difficulty?: DifficultyEnum): PyExercise => {
  const op = random(operators);
  const n = randint(2, 11);
  const p = randint(2, 11);
  let s = 0;
  let k = 1;
  switch (difficulty) {
    case DifficultyEnum.MEDIUM:
      s = randint(2, 11);
      break;
    case DifficultyEnum.HARD:
      s = randint(2, 11);
      k = randint(2, 11);
      break;
  }
  const exoVariables = {
    op,
    n,
    p,
    s,
    k,
  };

  const instruction = `Qu’affichera le programme suivant ?
  \`\`\`
  s=${s}
  n=${n}
  p=${p}
  for i in range(1,n+1):
    for j in range(1,p+1):
      s=s${op}${k}
  print(s) 
  \`\`\`
  `;
  return { instruction, exoVariables };
};

const getCorrectAnswer = (exo: PyExoVariables): number => {
  const nbIteration = exo.p * exo.n;
  return exo.op == "+"
    ? nbIteration * exo.k + exo.s
    : -nbIteration * exo.k + exo.s;
};
export const pyNestedForLoopExercise: Exercise<Identifiers> = {
  id: "pyNestedForLoopExercise",
  label: "Exercise sur les boucles for imbriquée en python",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getPyNestedForLoopExerciseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
