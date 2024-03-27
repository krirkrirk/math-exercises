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
import { earthMass, earthRayon } from "#root/pc/constants/earth";
import { earthG } from "#root/pc/constants/gravity";

type Identifiers = {};

const getGravitationalAttractionValueQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const mass = randint(100, 1000);
  //F = G/(Rt^2) * mT * mb
  const G = earthG.measure;
  const RT = earthRayon.measure.times(1000);
  const massKG = mass / 1000;
  const massEarth = earthMass.measure;
  const answerMeasure = G.times(massKG).times(massEarth).divide(RT.times(RT));
  const answer = answerMeasure.toTex({ scientific: 2 });
  const question: Question<Identifiers> = {
    answer,
    instruction: `On lance un objet de masse ${mass}. Déterminer la valeur de la force d'attraction gravitationnelle exercée par la Terre sur cet objet.

Données : 
- Rayon de la Terre : $R_T = ${earthRayon.measure.toTex({ scientific: 2 })}${
      earthRayon.unit
    }$
- Masse de la Terre : $m_T = ${earthMass.measure.toTex({ scientific: 2 })}${
      earthRayon.unit
    }$
- $G = ${earthG.measure.toTex({ scientific: 2 })}${earthG.unit}$    `,
    keys: [],
    answerFormat: "tex",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};
export const gravitationalAttractionValue: Exercise<Identifiers> = {
  id: "gravitationalAttractionValue",
  connector: "=",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getGravitationalAttractionValueQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
