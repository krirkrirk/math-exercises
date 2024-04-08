import { frenchify } from "./../../../math/utils/latex/frenchify";
import {
  Exercise,
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
import { randint } from "#root/math/utils/random/randint";
import { roundSignificant } from "#root/math/utils/round";
import { random } from "#root/utils/random";
// const homeObjects = [
//   { id: "lampLed", label: "ampoule LED", gender: "feminine", power: 7 },
//   { id: "lampLed", label: "ampoule LED", gender: "feminine", power: 7 },
//   {
//     id: "lampLow",
//     label: "ampoule à basse consommation",
//     gender: "feminine",
//     powers: 11,
//   },
//   {
//     id: "lampInc",
//     label: "ampoule à incandescence",
//     gender: "feminine",
//     power: 60,
//   },
//   { id: "wifi", label: "box WiFi", gender: "feminine", power: 13 },
//   { id: "tv", label: "télévision", gender: "feminine", power: 300 },
//   { id: "hairdryer", label: "sèche-cheveux", gender: "masculine", power: 1200 },
//   { id: "fridge", label: "réfrigérateur", gender: "masculine", power: 500 },
// ];

// const durations = [{label: "année",gender: "feminine", valueInSeconds:  }]

const powers = [15, 18, 50, 25, 65, 66, 7.5, 10];

type Identifiers = { power: number; seconds: number };

const getElectricEnergyFromPowerQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const power = random(powers);
  const seconds = randint(10, 61);
  const energy = power * seconds;

  const question: Question<Identifiers> = {
    answer: `${energy.toScientific(0).toTex({ scientific: 0 })}`,
    instruction: `Un chargeur a une puissance maximale de $${power}\\ \\text{W}$. Calculer l'énergie électrique qu'il fournit durant $${seconds}\\ \\text{s}$ de fonctionnement (en $\\text{J}$).`,
    keys: ["timesTenPower"],
    answerFormat: "tex",
    identifiers: { power, seconds },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, power, seconds },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const energy = power * seconds;
  const firstDivision = power / seconds;
  const secondDivision = seconds / power;
  tryToAddWrongProp(
    propositions,
    firstDivision.toScientific(0).toTex({ scientific: 0 }),
  );
  tryToAddWrongProp(
    propositions,
    secondDivision.toScientific(0).toTex({ scientific: 0 }),
  );
  tryToAddWrongProp(
    propositions,
    (energy * 0.1).toScientific(0).toTex({ scientific: 0 }),
  );

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const electricEnergyFromPower: Exercise<Identifiers> = {
  id: "electricEnergyFromPower",
  label: "Calculer une énergie électrique",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Électricité"],
  generator: (nb: number) =>
    getDistinctQuestions(getElectricEnergyFromPowerQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
