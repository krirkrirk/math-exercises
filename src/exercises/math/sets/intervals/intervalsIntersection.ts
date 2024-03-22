import {
  Exercise,
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
import { ClosureType } from "#root/tree/nodes/sets/closure";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  int1Min: number;
  int1Max: number;
  int1Closure: ClosureType;
  int2Min: number;
  int2Max: number;
  int2Closure: ClosureType;
};

const getIntervalsIntersectionQuestion: QuestionGenerator<Identifiers> = () => {
  const [int1, int2] = IntervalConstructor.differentRandoms(2);
  const inter = int1.intersection(int2);

  const answer = inter.tex;
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $I = ${int1.toTex()}$ et $J = ${int2.toTex()}$. Déterminer $I\\cap J$.`,
    keys: [
      "infty",
      "varnothing",
      "lbracket",
      "rbracket",
      "semicolon",
      "cup",
      "cap",
    ],
    answerFormat: "tex",
    identifiers: {
      int1Closure: int1.closure,
      int1Max: int1.max,
      int1Min: int1.min,
      int2Closure: int2.closure,
      int2Max: int2.max,
      int2Min: int2.min,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, int1Closure, int1Max, int1Min, int2Closure, int2Max, int2Min },
) => {
  const propositions: Proposition[] = [];

  addValidProp(propositions, answer);
  const int1 = new Interval(int1Min.toTree(), int1Max.toTree(), int1Closure);
  const int2 = new Interval(int2Min.toTree(), int2Max.toTree(), int2Closure);
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

export const intervalsIntersection: Exercise<Identifiers> = {
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
  subject: "Mathématiques",
};
