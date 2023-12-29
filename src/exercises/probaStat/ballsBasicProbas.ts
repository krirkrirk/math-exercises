import {
  shuffleProps,
  MathExercise,
  Proposition,
  Question,
  tryToAddWrongProp,
  QuestionGenerator,
  addValidProp,
  QCMGenerator,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  repartitions: number[];
  colorAskedIndex: number;
};

const getBallsBasicProbasQuestion: QuestionGenerator<Identifiers> = () => {
  const colors = ["rouge", "jaune", "verte"];
  const repartitions = [randint(1, 4), randint(1, 4), randint(1, 4)];
  const total = repartitions.reduce((acc, curr) => (acc += curr), 0);
  const colorAskedIndex = randint(0, 3);
  const colorAsked = colors[colorAskedIndex];
  const nbColorAsked = repartitions[colorAskedIndex];
  const answer = new Rational(nbColorAsked, total).simplify().tex;

  const question: Question<Identifiers> = {
    answer,
    instruction: `Dans un sac, il y a ${repartitions[0]} boules ${colors[0]}${
      repartitions[0] > 1 ? "s" : ""
    }, 
    ${repartitions[1]} boules ${colors[1]}${
      repartitions[1] > 1 ? "s" : ""
    } et ${repartitions[2]} boules ${colors[2]}${
      repartitions[2] > 1 ? "s" : ""
    }. Quelle est la probabilité de tirer une boule ${colorAsked} ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: { colorAskedIndex, repartitions },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, colorAskedIndex, repartitions },
) => {
  const total = repartitions.reduce((acc, curr) => (acc += curr), 0);
  const nbColorAsked = repartitions[colorAskedIndex];

  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, nbColorAsked + "");
  tryToAddWrongProp(propositions, `\\frac{1}{3}`);
  if (total === 3) {
    tryToAddWrongProp(propositions, `3`);
  }
  while (propositions.length < n) {
    const wrongAnswer = new Rational(randint(1, total), total).simplify().tex;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { colorAskedIndex, repartitions },
) => {
  const total = repartitions.reduce((acc, curr) => (acc += curr), 0);
  const nbColorAsked = repartitions[colorAskedIndex];

  const answer = new Rational(nbColorAsked, total)
    .simplify()
    .toTree({ allowFractionToDecimal: true });
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const ballsBasicProbas: MathExercise<Identifiers> = {
  id: "ballsBasicProbas",
  connector: "=",
  label: "Calcul de probabilité simple avec des boules colorés",
  levels: ["5ème", "4ème", "3ème", "2ndPro", "2nde", "CAP"],
  isSingleStep: true,
  sections: ["Probabilités"],
  generator: (nb: number) =>
    getDistinctQuestions(getBallsBasicProbasQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
