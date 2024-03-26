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
import { Decimal } from "#root/math/numbers/decimals/decimal";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

type Identifiers = {
  lightYear: number;
};

const getFindDistanceFromEarthQuestion: QuestionGenerator<Identifiers> = () => {
  const lightYear = round(randfloat(4.2, 50), 1);
  const speed = 300000000;
  const secondsInAYear = 365.25 * 24 * 3600;

  const lightDistanceTravelled = speed * secondsInAYear;
  const lightDistanceTravelledDecimal = new Decimal(lightDistanceTravelled);
  const lightDistanceTravelledDecimalScientificNotation =
    lightDistanceTravelledDecimal.toScientificNotation(1);

  const distanceFromEarth = new MultiplyNode(
    lightYear.toTree(),
    lightDistanceTravelledDecimalScientificNotation,
  ).simplify();

  const question: Question<Identifiers> = {
    answer: `${distanceFromEarth.toTex()}`,
    instruction: `Une planète se trouve à ${lightYear.frenchify()} années-lumières de nous. Calculer à quelle distance de la Terre se trouve la planète en mètres (en écriture scientifique avec 2 chiffres significatifs). 
    Aide : Passer par la distance parcourue par la lumière en une année. L'année-lumière est la distance parcourue par la lumière dans le vide en une année.`,
    keys: ["timesTenPower"],
    answerFormat: "tex",
    identifiers: { lightYear },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, lightYear },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  //error from not multiplying by distance in a lightYear
  const speed = 300000000;
  const distanceWithoutYearTime = lightYear * speed;
  const distanceWithoutYearTimeDecimal = new Decimal(distanceWithoutYearTime);
  tryToAddWrongProp(
    propositions,
    distanceWithoutYearTimeDecimal
      .toScientificNotation(1)
      .toTex({ allowOneInProducts: true }),
  );

  const secondsInAYear = 365.25 * 24 * 3600;
  //error from wrong distance found
  const wrongLightDistanceTravelled = speed / secondsInAYear;
  const wrongLightDistanceTravelledDecimal = new Decimal(
    wrongLightDistanceTravelled,
  );
  const wrongLightDistanceTravelledDecimalScientificNotation =
    wrongLightDistanceTravelledDecimal.toScientificNotation(1);

  const distanceFromEarth = new MultiplyNode(
    lightYear.toTree(),
    wrongLightDistanceTravelledDecimalScientificNotation,
  ).simplify();
  tryToAddWrongProp(propositions, distanceFromEarth.toTex());

  const speedDecimal = new Decimal(speed);
  while (propositions.length < n) {
    //error from not having the right speed
    const wrongSpeed = speedDecimal.multiplyByPowerOfTen(randint(-2, 2, [0]));

    const lightDistanceTravelled = wrongSpeed.value * secondsInAYear;
    const lightDistanceTravelledDecimal = new Decimal(lightDistanceTravelled);
    const ligthDistanceTravelledDecimalScientificNotation =
      lightDistanceTravelledDecimal.toScientificNotation(1);

    const distanceFromEarth = new MultiplyNode(
      lightYear.toTree(),
      ligthDistanceTravelledDecimalScientificNotation,
    ).simplify();
    tryToAddWrongProp(propositions, distanceFromEarth.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const findDistanceFromEarth: Exercise<Identifiers> = {
  id: "findDistanceFromEarth",
  label: "Calculer la distance d'une planète à la Terre",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Ondes"],
  generator: (nb: number) =>
    getDistinctQuestions(getFindDistanceFromEarthQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
