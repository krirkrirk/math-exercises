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
import { combinations } from "#root/math/utils/combinatorics/combination";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { alignTex } from "#root/utils/latex/alignTex";

type Identifiers = {
  exerciseVars: ExerciseVars;
};

type ExerciseVars = {
  n: number;
  k: number;
  a: number;
  b: number;
};

const getCalculateProbaOfBinomialDistributionQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exercise = generateExercise();
  const p = new Rational(exercise.a, exercise.b);
  const correctAns = new NumberNode(
    getCorrectAnswer(exercise.n, p.value, exercise.k),
  );

  const question: Question<Identifiers> = {
    answer: correctAns.toTex(),
    instruction: `Soit $X$ une variable aléatoire qui suit une loi binomiale de paramètres $n=${
      exercise.n
    }$ et $p=${p
      .toTree()
      .simplify()
      .toTex()}$. Donner une valeur arrondie au centième de $P(X=${
      exercise.k
    }).$`,
    keys: [],
    answerFormat: "tex",
    hint: `Si $X$ est une variable aléatoire qui suit une loi binomiale de paramètres $n$ et $p$, alors on a : 
    
$P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}$`,
    correction: `Si $X$ est une variable aléatoire qui suit une loi binomiale de paramètres $n$ et $p$, alors on a : 
    
$P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}$

Ici, on a donc : 

${alignTex([
  [
    `P(X=${exercise.k})`,
    "=",
    `\\binom{${exercise.n}}{${exercise.k}} ${new MultiplyNode(
      new PowerNode(p.toTree(), exercise.k.toTree()),
      new PowerNode(
        new Rational(exercise.b - exercise.a, exercise.b).toTree(),
        (exercise.n - exercise.k).toTree(),
      ),
    ).toTex()}`,
  ],
  ["", "\\approx", correctAns.toTex()],
])}`,
    identifiers: { exerciseVars: exercise },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, exerciseVars },
) => {
  const propositions: Proposition[] = [];
  const p = exerciseVars.a / exerciseVars.b;
  addValidProp(propositions, answer);
  generatePropositions(exerciseVars.n, p, exerciseVars.k).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  const correctAns = getCorrectAnswer(n, p, exerciseVars.k);
  let random;
  while (propositions.length < n) {
    random = new NumberNode(
      +(correctAns + randfloat(0.1, 0.6, 2, [correctAns])).toFixed(2),
    );
    tryToAddWrongProp(propositions, random.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generatePropositions = (n: number, p: number, k: number): string[] => {
  const kChooseN = combinations(k, n);
  const firstProposition = new NumberNode(
    +(Math.pow(p, n - k) * Math.pow(1 - p, k)).toFixed(2),
  );

  const secondProposition = new NumberNode(
    +(Math.pow(p, n) * Math.pow(1 - p, k)).toFixed(2),
  );

  const thirdProposition = new NumberNode(
    +(kChooseN * Math.pow(p, k)).toFixed(2),
  );
  return [
    firstProposition.toTex(),
    secondProposition.toTex(),
    thirdProposition.toTex(),
  ].filter((value) => +value !== 0);
};

const getCorrectAnswer = (n: number, p: number, k: number): number => {
  const kChooseN = combinations(k, n);
  return +(kChooseN * Math.pow(p, k) * Math.pow(1 - p, n - k)).toFixed(2);
};

const generateExercise = (): ExerciseVars => {
  let n;
  let k;
  let a;
  let b;
  let correctAns;
  do {
    n = randint(2, 9);
    k = randint(1, n);
    b = randint(2, 11);
    a = randint(1, b);
    correctAns = getCorrectAnswer(n, a / b, k);
  } while (correctAns === 0);
  return { n, k, a, b };
};
export const calculateProbaOfBinomialDistribution: Exercise<Identifiers> = {
  id: "calculateProbaOfBinomialDistribution",
  label: "Calculer une probabilité avec la loi binomiale",
  levels: ["TermTech"],
  isSingleStep: true,
  sections: ["Probabilités"],
  generator: (nb: number) =>
    getDistinctQuestions(getCalculateProbaOfBinomialDistributionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
