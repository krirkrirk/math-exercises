import {
  MathExercise,
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
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";
type QCMProps = {
  answer: string;
};
type VEAProps = {
  answer: string;
};

const getCircleCircumference: QuestionGenerator<QCMProps, VEAProps> = () => {
  const radius = randint(1, 13);
  const diametre = randint(1, 21);

  const coin = coinFlip();
  const answerNb = coin
    ? round(2 * Math.PI * radius, 2)
    : round(Math.PI * diametre, 2);
  const answer = (answerNb + "").replace(".", ",");
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Calculer la circonférence d'un cercle de ${
      coin ? "rayon " + `$${radius}$` : "diamètre " + `$${diametre}$`
    } cm.`,
    answer: answer + "\\text{cm}",
    answerFormat: "tex",
    keys: ["cm", "cm2"],
    qcmGeneratorProps: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer + "\\text{cm}");
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      (round(Math.random() * 100, 2) + "\\text{cm}").replace(".", ","),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<VEAProps> = (ans, { answer }) => {
  const texs = [answer, answer + "\\text{cm}"];
  return texs.includes(ans);
};

export const circleCircumference: MathExercise<QCMProps, VEAProps> = {
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
};
