import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  isImage: boolean;
  x: number;
  y: number;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, isImage, x, y },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, getAnswer({ isImage, x: y, y: x }));
  tryToAddWrongProp(propositions, `${x}=${y}`);
  tryToAddWrongProp(propositions, getAnswer({ isImage, x: y, y: y }));
  // tryToAddWrongProp(propositions, getAnswer({ isImage, x: x, y: x }));

  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return `f\\left(${identifiers.x}\\right)=${identifiers.y}`;
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  let instruction = "Traduire par une égalité la phrase suivante : \n \n";
  instruction += identifiers.isImage
    ? `
  "L'image de $${identifiers.x}$ par $f$ est $${identifiers.y}$"
  `
    : `"Un antécédent de $${identifiers.y}$ par $f$ est $${identifiers.x}$"`;
  return instruction;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `Si $f(x) = y$, alors $x$ est un antécédent de $y$ par $f$, et $y$ est l'image de $x$ par $f$.`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  return `Si $f(x) = y$, alors $x$ est un antécédent de $y$ par $f$, et $y$ est l'image de $x$ par $f$. Ici, on a donc $${getAnswer(
    identifiers,
  )}$`;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["fParenthesis", "equal"];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer, x, y }) => {
  const reversed = answer.split("=").reverse().join("=");
  return [answer, reversed].includes(ans);
};

const getImageAntecedentFromSentenceQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const x = randint(-10, 10);
  const y = randint(-10, 10, [x]);
  const identifiers: Identifiers = {
    isImage: coinFlip(),
    x,
    y,
  };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
  };

  return question;
};

export const imageAntecedentFromSentence: Exercise<Identifiers> = {
  id: "imageAntecedentFromSentence",
  connector: "\\iff",
  label: "Traduire une phrase contenant image ou antécédent en une égalité",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getImageAntecedentFromSentenceQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getHint,
  getCorrection,
  getAnswer,
  hasHintAndCorrection: true,
};
