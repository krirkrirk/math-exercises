import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  GetGGBOptions,
  GetStudentGGBOptions,
  GetGGBAnswer,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { IntegerConstructor } from "#root/math/numbers/integer/integer";
import { randint } from "#root/math/utils/random/randint";
import { toSeperatedThousands } from "#root/utils/numberPrototype/toSeparatedThousands";
import { numberToFrenchWord } from "#root/utils/strings/numberToFrenchWord";

type Identifiers = {
  nb: number;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented");
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return numberToFrenchWord(identifiers.nb);
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  return `Écrire le nombre $${toSeperatedThousands(
    identifiers.nb + "",
  )}$ en lettres.`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return ``;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  return ``;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const getNumberToFrenchWritingQuestion: QuestionGenerator<Identifiers> = () => {
  const nb = IntegerConstructor.random(randint(2, 8));
  const identifiers: Identifiers = {
    nb,
  };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "raw",
    identifiers,
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
  };

  return question;
};

export const numberToFrenchWriting: Exercise<Identifiers> = {
  id: "numberToFrenchWriting",
  connector: "=",
  label: "Écrire un nombre entier en lettres",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getNumberToFrenchWritingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  ggbTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getHint,
  getCorrection,
  getAnswer,
};
