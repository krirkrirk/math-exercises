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
import { lightSpeed } from "#root/pc/constants/mechanics/waves";
import { Measure } from "#root/pc/measure/measure";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  lightYear: number;
  distanceMeters: Measure;
  isLightYearToMeters: boolean;
};

const getLightDistanceConversionQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const lightYear = randfloat(10, 1000, 2);
  const speed = lightSpeed.measure;
  const secondsInAYear = 365.25 * 24 * 3600;

  const lightDistanceTravelled = speed.times(secondsInAYear);
  const distanceFromEarthMeters = lightDistanceTravelled.times(lightYear);
  const isLightYearToMeters = coinFlip();
  const answer = isLightYearToMeters
    ? distanceFromEarthMeters.toSignificant(2).toTex()
    : lightYear.toScientific(2).toTex();

  const hint = isLightYearToMeters
    ? `Pour convertir des années-lumière en mètres, utilisez les relations suivantes :
  - Une année-lumière est la distance parcourue par la lumière en une année.
  - La vitesse de la lumière est $c = 3 \\times 10^8 \\text{ m/s}$.
  - Il y a $365.25 \\text{ jours} \\times 24 \\text{ heures/jour} \\times 3600 \\text{ secondes/heure}$ secondes dans une année (Le 0.25 compte pour la moyenne sur quatres années dont une bissextile).
  
  La distance parcourue par la lumière en une année est :
  $$
  c \\times \\text{secondes par année}
  $$
  
  Pour convertir des années-lumière en mètres, multipliez la distance en années-lumière par la distance parcourue par la lumière en une année.`
    : `Pour convertir une distance en mètres en années-lumières, utilisez les relations suivantes :
  - Une année-lumière est la distance parcourue par la lumière en une année.
  - La vitesse de la lumière est $c = 3 \\times 10^8 \\text{ m/s}$.
  - Il y a $365.25 \\text{ jours} \\times 24 \\text{ heures/jour} \\times 3600 \\text{ secondes/heure}$ secondes dans une année (Le 0.25 compte pour la moyenne sur quatres années dont une bissextile).
  
  La distance parcourue par la lumière en une année est :
  $$
  c \\times \\text{secondes par année}
  $$

  Pour convertir des mètres en années-lumière, divisez la distance en mètres par la distance parcourue par la lumière en une année.`;

  const correction = isLightYearToMeters
    ? `La distance parcourue par la lumière en une année est donnée par :
  $$
  c \\times \\text{secondes par année} = 3 \\times 10^8 \\text{ m/s} \\times 365.25 \\times 24 \\times 3600 \\text{ s}
  $$

  En simplifiant, nous obtenons :
  $$
  3 \\times 10^8 \\text{ m/s} \\times 31,557,600 \\text{ s} = 9.46728 \\times 10^{15} \\text{ m}
  $$

  Pour convertir des années-lumière en mètres, nous utilisons la relation suivante :
  $$
  \\text{distance en mètres} = \\text{distance en années-lumière} \\times 9.46728 \\times 10^{15} \\text{ m}
  $$

  En appliquant cette relation avec la valeur donnée de ${lightYear} années-lumière, nous obtenons :
  $$
  \\text{distance en mètres} = ${lightYear} \\times 9.46728 \\times 10^{15} = ${distanceFromEarthMeters
        .toSignificant(2)
        .toTex()} \\text{ m}
  $$`
    : `La distance parcourue par la lumière en une année est donnée par :
  $$
  c \\times \\text{secondes par année} = 3 \\times 10^8 \\text{ m/s} \\times 365.25 \\times 24 \\times 3600 \\text{ s}
  $$

  En simplifiant, nous obtenons :
  $$
  3 \\times 10^8 \\text{ m/s} \\times 31,557,600 \\text{ s} = 9.46728 \\times 10^{15} \\text{ m}
  $$

  Pour convertir des mètres en années-lumière, nous utilisons la relation suivante :
  $$
  \\text{distance en années-lumière} = \\frac{\\text{distance en mètres}}{9.46728 \\times 10^{15} \\text{ m}}
  $$

  En appliquant cette relation avec la valeur donnée de $${distanceFromEarthMeters
    .toSignificant(2)
    .toTex()} \\text{m}$, nous obtenons :
  $$
  \\text{distance en années-lumière} = \\frac{${distanceFromEarthMeters
    .toSignificant(2)
    .toTex()}}{9.46728 \\times 10^{15}} = ${lightYear.toScientific(2).toTex()}
  $$`;

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: isLightYearToMeters
      ? `Une planète se trouve à $${lightYear.frenchify()}$ années-lumières de nous. Calculer à quelle distance de la Terre se trouve la planète en mètres (en écriture scientifique avec 2 chiffres significatifs).`
      : `Une planète se trouve à $${distanceFromEarthMeters
          .toSignificant(2)
          .toTex()}\\ \\text{m}$ de nous. Calculer à quelle distance en années-lumières se trouve la planète de la Terre (en écriture scientifique avec 2 chiffres significatifs).`,
    hint,
    correction,
    keys: ["timesTenPower"],
    answerFormat: "tex",
    identifiers: {
      lightYear,
      distanceMeters: distanceFromEarthMeters,
      isLightYearToMeters,
    },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, lightYear, distanceMeters, isLightYearToMeters },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const speed = lightSpeed.measure;
  const secondsInAYear = 365.25 * 24 * 3600;

  const lightDistanceTravelled = speed.times(secondsInAYear);
  const distanceFromEarthMeters = lightDistanceTravelled.times(lightYear);

  const w1 = lightDistanceTravelled.divide(lightYear).toSignificant(2).toTex();
  const w2 = distanceFromEarthMeters.toSignificant(2).toTex();
  const w3 = lightYear.toScientific(2).toTex();
  const w4 = lightDistanceTravelled.times(365.25).toSignificant(2).toTex();

  tryToAddWrongProp(propositions, w1);
  tryToAddWrongProp(propositions, w2);
  tryToAddWrongProp(propositions, w3);
  tryToAddWrongProp(propositions, w4);

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new Measure(randfloat(1, 10, 2), randint(1, 10)).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, lightYear, distanceMeters, isLightYearToMeters },
) => {
  const speed = lightSpeed.measure;
  const secondsInAYear = 365.25 * 24 * 3600;

  const lightDistanceTravelled = speed.times(secondsInAYear);
  const distanceFromEarthMeters = lightDistanceTravelled.times(lightYear);
  const validanswer1 = isLightYearToMeters
    ? distanceFromEarthMeters.toSignificant(1).toTex()
    : lightYear.toScientific(1).toTex();
  const validanswer2 = isLightYearToMeters
    ? distanceFromEarthMeters.toSignificant(2).toTex()
    : lightYear.toScientific(2).toTex();
  const validanswer3 = isLightYearToMeters
    ? distanceFromEarthMeters.toSignificant(3).toTex()
    : lightYear.toScientific(3).toTex();
  const validanswer4 = isLightYearToMeters
    ? distanceFromEarthMeters.evaluate()
    : lightYear.toTree().toTex();

  const latexs = [validanswer1, validanswer2, validanswer3, validanswer4];

  return latexs.includes(ans);
};

export const lightDistanceConversion: Exercise<Identifiers> = {
  id: "lightDistanceConversion",
  label: "Conversion entre années-lumière et distance en mètres",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Ondes"],
  generator: (nb: number) =>
    getDistinctQuestions(getLightDistanceConversionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
  hasHintAndCorrection: true,
};
