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
  const exercise = generateExercise(DifficultyEnum.HARD);
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
  generateProposition(exercise).forEach((value) =>
    tryToAddWrongProp(propositions, value.simplify().toTex()),
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new NumberNode(randint(+answer - 10, +answer + 10, [+answer]))
        .simplify()
        .toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const generateProposition = (exo: PyExoVariables): NumberNode[] => {
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
  const thridProposition = new NumberNode(exo.n * exo.k);
  return [firstProposition, secondProposition, thridProposition];
};

const isAnswerValid: VEA<Identifiers> = (ans, { exercise }) => {
  return getCorrectAnswer(exercise).simplify().toAllValidTexs().includes(ans);
};

const generateExercise = (difficulty?: DifficultyEnum): PyExercise => {
  const op = operators[randint(0, operators.length)];
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

  const instruction = `\`\`\`\ Qu’affichera le programme suivant ?
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

const getCorrectAnswer = (exo: PyExoVariables): NumberNode => {
  const nbIteration = exo.p * exo.n;
  return exo.op == "+"
    ? new NumberNode(nbIteration * exo.k + exo.s)
    : new NumberNode(-nbIteration * exo.k + exo.s);
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
