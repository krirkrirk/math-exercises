import {
  Proposition,
  Question,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  tryToAddWrongProp,
  VEA,
  Exercise,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  frequencyEmitted: number;
  ambulanceSpeed: number;
};
const soundSpeed = 340; // Vitesse du son dans l'air en m/s
const observerSpeed = 0; // La vitesse de l'observateur est supposée être nulle (observateur immobile)
const getPerceivedFrequency: QuestionGenerator<Identifiers> = () => {
  const frequencyEmitted = randint(200, 1500); // Fréquence émise en Hz

  const ambulanceSpeed = Math.floor(Math.random() * 40 + 10); // Vitesse de l'ambulance entre 10 et 50 m/s

  const perceivedFrequency =
    (frequencyEmitted * (soundSpeed + observerSpeed)) /
    (soundSpeed - ambulanceSpeed);

  const instruction = `Une ambulance émet un son d'une fréquence de $${frequencyEmitted}$ Hz lorsqu'elle
  s'approche d'un observateur à une vitesse de $${ambulanceSpeed}$ m/s. Si la vitesse du son
  dans l'air est de $340$ m/s, calculer la fréquence perçue par l'observateur.`;

  const answer = `${round(perceivedFrequency, 0)} \\ Hz`;
  const question: Question<Identifiers> = {
    instruction,
    answer,
    keys: ["Hz"],
    answerFormat: "tex",
    identifiers: { ambulanceSpeed, frequencyEmitted },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, ambulanceSpeed, frequencyEmitted },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const perceivedFrequency =
    (frequencyEmitted * (soundSpeed + observerSpeed)) /
    (soundSpeed - ambulanceSpeed);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      round(perceivedFrequency * (0.3 + Math.random() * 1.5), 0) + " \\ Hz",
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const perceivedFrequency: Exercise<Identifiers> = {
  id: "perceivedFrequency",
  connector: "\\iff",
  label: "Calculer une fréquence perçue par un observateur",
  levels: ["4ème", "3ème", "2nde"],
  sections: ["Ondes"],
  subject: "Physique",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getPerceivedFrequency, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
