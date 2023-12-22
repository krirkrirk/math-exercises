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

const getCircleArea: QuestionGenerator<QCMProps, VEAProps> = () => {
  const radius = randint(1, 13);
  const diametre = randint(1, 21);

  const coin = coinFlip();
  const answerNb = coin
    ? round(Math.PI * radius ** 2, 2)
    : round(Math.PI * (diametre / 2) ** 2, 2);
  const answer = (answerNb + "").replace(".", ",");
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Calculer l'aire d'un cercle de ${
      coin ? "rayon " + `$${radius}$` : "diamètre " + `$${diametre}$`
    } cm (arrondir au centième).`,
    answer: answer + "\\text{cm}^2",
    answerFormat: "tex",
    keys: ["cm", "cm2"],
    qcmGeneratorProps: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer + "\\text{cm}^2");
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      (round(Math.random() * 100, 2) + "\\text{cm}^2").replace(".", ","),
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<VEAProps> = (ans, { answer }) => {
  const texs = [answer, answer + "\\text{cm}^2"];
  return texs.includes(ans);
};
export const circleArea: MathExercise<QCMProps, VEAProps> = {
  id: "circleArea",
  connector: "=",
  label: "Calculer l'aire d'un cercle",
  levels: ["4ème", "3ème", "2nde"],
  isSingleStep: false,
  sections: ["Aires", "Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getCircleArea, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
