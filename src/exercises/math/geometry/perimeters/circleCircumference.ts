import {
  Exercise,
  Question,
  Proposition,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  tryToAddWrongProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { shuffle } from "#root/utils/alea/shuffle";
type Identifiers = {
  coin: boolean;
  radius: number;
  diametre: number;
};

const getCircleCircumference: QuestionGenerator<Identifiers> = () => {
  const radius = randint(1, 13);
  const diametre = randint(1, 21);

  const coin = coinFlip();
  const answerNb = coin
    ? round(2 * Math.PI * radius, 2)
    : round(Math.PI * diametre, 2);
  const answer = (answerNb + "").replace(".", ",");
  const answerTex = answer + "\\text{cm}";
  const question: Question<Identifiers> = {
    instruction: `Calculer la circonférence d'un cercle de ${
      coin ? "rayon " + `$${radius}$` : "diamètre " + `$${diametre}$`
    } cm.`,
    answer: answerTex,
    answerFormat: "tex",
    keys: ["cm", "cm2"],
    identifiers: { coin, diametre, radius },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      (round(Math.random() * 100, 2) + "\\text{cm}").replace(".", ","),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const texs = [answer, answer.split("\\text")[0]];
  return texs.includes(ans);
};

export const circleCircumference: Exercise<Identifiers> = {
  id: "circleCircumference",
  connector: "=",
  label: "Calculer la circonférence d'un cercle",
  levels: ["4ème", "3ème", "2nde"],
  isSingleStep: false,
  sections: ["Périmètres", "Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getCircleCircumference, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
