import {
  Exercise,
  GetAnswer,
  GetInstruction,
  GetKeys,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { DecimalConstructor } from "#root/math/numbers/decimals/decimal";
import { RationalConstructor } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { random } from "#root/utils/alea/random";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  type: number;
  nb: string;
};
const hotFix = (q: Question<Identifiers>) => {
  if (q.identifiers.type === 3) {
    return {
      ...q,
      ...getQuestionFromIdentifiers(getIdentifiers(q.identifiers)),
    };
  } else return q;
};
const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  return `Donner le plus petit ensemble auquel le nombre $${identifiers.nb}$ appartient.`;
};
const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const sets = ["N", "Z", "D", "Q", "R"];
  if (identifiers.type > -1) {
    return `\\mathbb{${sets[identifiers.type]}}`;
  }
  return "";
};

const getIdentifiers = (prevIdentifiers?: Identifiers): Identifiers => {
  //N Z D Q R (racine2, pi)
  //fraction simplifiable en décimal/entier
  //racine carrée simplifiable en entier / Fraction
  //
  const type = prevIdentifiers?.type ?? randint(0, 5);
  let nb = "";
  switch (type) {
    case 0:
      nb = randint(0, 1000) + "";
      break;
    case 1:
      nb = -randint(0, 1000) + "";
      break;
    case 2:
      nb = DecimalConstructor.random(-50, 50, randint(1, 4)).toTree().toTex();
      break;
    case 3:
      nb = RationalConstructor.randomPureRational().toTree().toTex();
      break;
    case 4:
      nb = random(["\\sqrt 2", "\\pi"]);
      break;
  }
  return { type, nb };
};
const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [
    "varnothing",
    "naturals",
    "integers",
    "decimals",
    "rationals",
    "reals",
  ];
};

const getQuestionFromIdentifiers = (
  identifiers: Identifiers,
): Question<Identifiers> => {
  return {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
  };
};
const getSetBelongingQuestion: QuestionGenerator<Identifiers> = () => {
  const identifiers = getIdentifiers();
  return getQuestionFromIdentifiers(identifiers);
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  const availableSets = ["N", "Z", "D", "Q", "R"]
    .map((el) => `\\mathbb{${el}}`)
    .filter((el) => el !== answer);
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const wrongAnswer = random(availableSets);

    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return [answer].includes(ans);
};

export const setBelonging: Exercise<Identifiers> = {
  id: "setBelonging",
  connector: "\\iff",
  label: "Déterminer le plus petit ensemble auquel un nombre appartient",
  levels: ["2nde", "1reESM"],
  isSingleStep: true,
  sections: ["Ensembles et intervalles"],
  generator: (nb: number) => getDistinctQuestions(getSetBelongingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getAnswer,
  getQuestionFromIdentifiers,
  hotFix,
};
