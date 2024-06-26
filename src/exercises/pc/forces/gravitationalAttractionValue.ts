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
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { earthMass, earthRayon } from "#root/pc/constants/earth";
import { earthG } from "#root/pc/constants/gravity";

type Identifiers = {
  mass: number;
};

const getGravitationalAttractionValueQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const mass = randint(20, 900);
  //F = G/(Rt^2) * mT * mb
  const G = earthG.measure;
  const RT = earthRayon.measure.times(1000);
  const massKG = mass / 1000;
  const massEarth = earthMass.measure;
  const answerMeasure = G.times(massKG).times(massEarth).divide(RT.times(RT));
  // const answerMeasure = G.times(massKG);
  console.log(mass, answerMeasure.significantPart, answerMeasure.exponent);
  const answer = answerMeasure.toTex({ scientific: 2 }) + "N";
  const question: Question<Identifiers> = {
    answer,
    instruction: `On lance un objet de masse $${mass}\\ \\text{g}$. Déterminer la valeur de la force d'attraction gravitationnelle exercée par la Terre sur cet objet.

Données : 
+ Rayon de la Terre : $R_T = ${earthRayon.measure.toTex({
      scientific: 2,
    })}\\ ${earthRayon.unit}$

+ Masse de la Terre : $m_T = ${earthMass.measure.toTex({ scientific: 2 })}\\ ${
      earthMass.unit
    }$

+ $G = ${earthG.measure.toTex({ scientific: 2 })}\\ ${earthG.unit}$`,
    keys: ["N", "timesTenPower"],
    answerFormat: "tex",
    identifiers: { mass },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, mass }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const G = earthG.measure;
  const RT = earthRayon.measure;
  const massEarth = earthMass.measure;
  tryToAddWrongProp(
    propositions,
    G.times(mass)
      .times(massEarth)
      .divide(RT.times(RT))
      .toTex({ scientific: 2 }) + "N",
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      round(randfloat(1, 20), 2).frenchify() + "N",
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return [answer, answer.replace("N", "")].includes(ans);
};
export const gravitationalAttractionValue: Exercise<Identifiers> = {
  id: "gravitationalAttractionValue",
  connector: "=",
  label: "Calculer la force d'attraction gravitationnelle",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Forces"],
  generator: (nb: number) =>
    getDistinctQuestions(getGravitationalAttractionValueQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
