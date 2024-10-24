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
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  int1Min: number;
  int1Max: number;
  int1Closure: ClosureType;
  int2Min: number;
  int2Max: number;
  int2Closure: ClosureType;
};

const getIntervalsUnionQuestion: QuestionGenerator<Identifiers> = () => {
  const [int1, int2] = IntervalConstructor.differentRandoms(2);
  const set = int1.union(int2);
  const answer = set.tex;
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $I = ${int1.tex}$ et $J = ${int2.tex}$. Déterminer $I\\cup J$.`,
    keys: ["infty", "lbracket", "rbracket", "semicolon", "cup", "cap"],
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
  tryToAddWrongProp(propositions, int1.intersection(int2).toTex());

  while (propositions.length < n) {
    const wrongAnswer = IntervalConstructor.random().tex;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const intervalsUnion: Exercise<Identifiers> = {
  id: "intervalsUnion",
  connector: "=",
  label: "Déterminer l'union de deux intervalles",
  levels: ["2nde", "2ndPro", "1reTech", "CAP"],
  isSingleStep: true,
  sections: ["Ensembles et intervalles"],
  generator: (nb: number) =>
    getDistinctQuestions(getIntervalsUnionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
