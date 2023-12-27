import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import {
  Interval,
  IntervalConstructor,
} from "#root/math/sets/intervals/intervals";
import { shuffle } from "#root/utils/shuffle";

const getIntervalsIntersectionQuestion: QuestionGenerator<Identifiers> = () => {
  const [int1, int2] = IntervalConstructor.differentRandoms(2);
  const inter = int1.intersection(int2);

  const answer = inter.tex;
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $I = ${int1.toTex()}$ et $J = ${int2.toTex()}$. Déterminer $I\\cap J$.`,
    keys: [
      "infty",
      "emptyset",
      "lbracket",
      "rbracket",
      "semicolon",
      "cup",
      "cap",
    ],
    answerFormat: "tex",
    identifiers: { answer, int1Tex: int1.tex, int2Tex: int2.tex },
  };

  return question;
};

type Identifiers = {
  answer: string;
  int1Tex: string;
  int2Tex: string;
};
type VEAProps = {
  answer: string;
  int1Tex: string;
  int2Tex: string;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, int1Tex, int2Tex },
) => {
  const propositions: Proposition[] = [];

  addValidProp(propositions, answer);
  const int1 = new Interval(int1Tex);
  const int2 = new Interval(int2Tex);
  tryToAddWrongProp(propositions, int1.union(int2).tex);

  while (propositions.length < n) {
    const wrongAnswer = IntervalConstructor.random().tex;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const intervalsIntersection: MathExercise<Identifiers> = {
  id: "intervalsIntersection",
  connector: "=",
  label: "Déterminer l'intersection de deux intervalles",
  levels: ["2nde", "1reESM"],
  isSingleStep: true,
  sections: ["Ensembles et intervalles"],
  generator: (nb: number) =>
    getDistinctQuestions(getIntervalsIntersectionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
