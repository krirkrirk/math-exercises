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
import { MathSet } from "#root/math/sets/mathSet";
import { Closure, ClosureType } from "#root/tree/nodes/sets/closure";
import {
  DiscreteSetNode,
  isDiscreteSetNode,
} from "#root/tree/nodes/sets/discreteSetNode";
import { isIntervalNode } from "#root/tree/nodes/sets/intervalNode";
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

  const answer = inter.toTex();

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
      "lbrace",
      "rbrace",
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
    hint: `Détermine l'ensemble des nombres qui appartiennent à la fois à $I$ et à $J$.`,
    correction: `$I$ contient les nombres ${int1.toTree().toText(true, false)}. 
    
$J$ contient les nombres ${int2.toTree().toText(false, false)}.
    
${
  isDiscreteSetNode(inter) && inter.elements.length === 0
    ? `Il n'y a donc aucun nombre commun aux intervalles $I$ et $J$.`
    : isDiscreteSetNode(inter) && inter.elements.length === 1
    ? `Il n'y a donc qu'un nombre commun aux intervalles $I$ et $J$ : $${inter.elements[0].toTex()}$.`
    : isIntervalNode(inter) &&
      `Les nombres communs à $I$ et $J$ sont donc les nombres ${inter.toText(
        true,
        false,
      )}.`
}
    
Ainsi, $I\\cap J = ${answer}$`,
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
  hasHintAndCorrection: true,
};
