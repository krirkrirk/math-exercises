import {
  MathExercise,
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
import { GeometricSequenceConstructor } from "#root/math/sequences/geometricSequence";

type Identifiers = {
  reason: string;
  firstTerm: string;
};

const getSequenceGeometricLimitQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const sequence = GeometricSequenceConstructor.randomWithLimit();
  const answer = sequence.getLimit();
  if (!answer) throw Error("received geometric sequence with no limit");

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Déterminer la limite de la suite $u$ définie par : $u_n = ${sequence
      .toTree()
      .toTex()}$.`,
    keys: ["infty"],
    answerFormat: "tex",
    identifiers: {
      reason: sequence.reason.toTree().toTex(),
      firstTerm: sequence.firstTerm.toTree().toTex(),
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, reason, firstTerm },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, "+\\infty");
  tryToAddWrongProp(propositions, "-\\infty");
  tryToAddWrongProp(propositions, "0");
  tryToAddWrongProp(propositions, reason + "");
  tryToAddWrongProp(propositions, firstTerm + "");

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const sequenceGeometricLimit: MathExercise<Identifiers> = {
  id: "sequenceGeometricLimit",
  connector: "=",
  label: "Limite d'une suite géométrique",
  levels: ["TermSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Limites", "Suites"],
  generator: (nb: number) =>
    getDistinctQuestions(getSequenceGeometricLimitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
