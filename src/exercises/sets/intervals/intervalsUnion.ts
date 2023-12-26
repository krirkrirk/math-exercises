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

const getIntervalsUnionQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const [int1, int2] = IntervalConstructor.differentRandoms(2);
  const set = int1.union(int2);
  const answer = set.tex;
  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction: `Soit $I = ${int1.tex}$ et $J = ${int2.tex}$. Déterminer $I\\cup J$.`,
    keys: ["infty", "lbracket", "rbracket", "semicolon", "cup", "cap"],
    answerFormat: "tex",
    qcmGeneratorProps: { answer, int1Tex: int1.tex, int2Tex: int2.tex },
  };

  return question;
};
const getPropositions: QCMGenerator<QCMProps> = (
  n,
  { answer, int1Tex, int2Tex },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const int1 = new Interval(int1Tex);
  const int2 = new Interval(int2Tex);
  tryToAddWrongProp(propositions, int1.intersection(int2).tex);

  while (propositions.length < n) {
    const wrongAnswer = IntervalConstructor.random().tex;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

type QCMProps = {
  answer: string;
  int1Tex: string;
  int2Tex: string;
};
type VEAProps = {
  answer: string;

  int1Tex: string;
  int2Tex: string;
};

const isAnswerValid: VEA<VEAProps> = (ans, { answer }) => {
  return ans === answer;
};

export const intervalsUnion: MathExercise<QCMProps, VEAProps> = {
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
};
