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
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  raison: number;
  final: number;
};

const getGeometricFirstTermsSumQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const raison = randint(2, 8);
  const final = randint(5, 10);
  const answer = (raison ** (final + 1) - 1) / (raison - 1) + "";

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Calculer la somme suivante : $1 + ${raison} + ${raison}^2 + \\ldots + ${raison}^{${final}}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { raison, final },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, raison, final },
) => {
  const propositions: Proposition[] = [];

  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, (raison ** (final + 1) - 1).toString());
  tryToAddWrongProp(
    propositions,
    ((raison ** final - 1) / (raison - 1)).toString(),
  );

  while (propositions.length < n) {
    const wrongAnswer = randint(1000, 10000) + "";
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const geometricFirstTermsSum: Exercise<Identifiers> = {
  id: "geometricFirstTermsSum",
  connector: "=",
  label: "Somme des termes d'une suite géométrique",
  levels: [
    "1reESM",
    "1rePro",
    "1reSpé",
    "1reTech",
    "TermPro",
    "TermSpé",
    "TermTech",
  ],
  isSingleStep: true,
  sections: ["Suites"],
  generator: (nb: number) =>
    getDistinctQuestions(getGeometricFirstTermsSumQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
