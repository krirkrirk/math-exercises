import {
  Exercise,
  GetAnswer,
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

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const sets = ["N", "Z", "D", "Q", "R"];
  if (identifiers.type > -1) {
    return `\\mathbb{${sets[identifiers.type]}}`;
  }
  return "";
};
const getSetBelongingQuestion: QuestionGenerator<Identifiers> = () => {
  //N Z D Q R (racine2, pi)
  //fraction simplifiable en décimal/entier
  //racine carrée simplifiable en entier / Fraction
  //
  const type = randint(0, 5);
  let answer = "";
  let nb = "";
  switch (type) {
    case 0:
      nb = randint(0, 1000) + "";
      answer = "\\mathbb{N}";
      break;
    case 1:
      nb = -randint(0, 1000) + "";
      answer = "\\mathbb{Z}";
      break;
    case 2:
      nb = DecimalConstructor.random(-50, 50, randint(1, 4)).toTree().toTex();
      answer = "\\mathbb{D}";
      break;
    case 3:
      nb = RationalConstructor.randomIrreductible().toTree().toTex();
      answer = "\\mathbb{Q}";
      break;
    case 4:
      nb = random(["\\sqrt 2", "\\pi"]);
      answer = "\\mathbb{R}";
      break;
  }

  const question: Question<Identifiers> = {
    answer,
    instruction: `Donner le plus petit ensemble auquel le nombre $${nb}$ appartient.`,
    keys: [
      "varnothing",
      "naturals",
      "integers",
      "decimals",
      "rationals",
      "reals",
    ],
    answerFormat: "tex",
    identifiers: { nb, type },
  };

  return question;
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
};
