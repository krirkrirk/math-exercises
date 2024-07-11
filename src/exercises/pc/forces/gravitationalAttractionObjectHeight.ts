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
import { planets } from "#root/pc/constants/mechanics/planets";
import { earthG } from "#root/pc/constants/mechanics/gravitational";
import { Measure } from "#root/pc/measure/measure";

type Identifiers = {
  planet: string;
  mass: number;
  h: number;
};

const getGravitationalAttractionObjectHeightQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const mass = randint(20, 900); // Masse de l'objet en kilogrammes
  const selectedPlanet = planets.find((planet) => planet.name === "Terre")!; // Sélectionne la Terre

  const G = earthG.measure;
  const RT = selectedPlanet.radius.measure.times(new Measure(1, 3)); // Le rayon de la Terre en mètres
  const h = randint(100, 5000); // La hauteur de l'objet en kilomètres
  const height = new Measure(h, 3);
  const d = height.add(RT);
  const massKG = new Measure(mass, 0); // Convertir en kilogrammes
  const massEarth = selectedPlanet.mass;
  const force = G.times(massKG).times(massEarth.measure).divide(d.times(d));
  const answer = h.toScientific(2).toTex();

  const question: Question<Identifiers> = {
    answer,
    instruction: `On lance un objet de masse $${mass}\\ \\text{kg}$. \n Déterminer la hauteur de cet objet par rapport à la surface de la Terre en $\\text{km}$, à partir de la valeur de la force d'attraction gravitationnelle.

Données : 
+ Force d'attraction gravitationnelle : $F = ${force
      .toSignificant(2)
      .toTex()}\\ N$
+ Rayon de la Terre : $R_T = ${selectedPlanet.radius.measure.toTex({
      scientific: 2,
    })}\\ ${selectedPlanet.radius.unit}$
+ Masse de la Terre : $m_T = ${selectedPlanet.mass.measure.toTex({
      scientific: 2,
    })}\\ ${selectedPlanet.mass.unit}$
+ $G = ${G.toTex({ scientific: 2 })}\\ ${earthG.unit}$`,
    keys: ["N", "timesTenPower"],
    answerFormat: "tex",
    identifiers: { planet: selectedPlanet.name, mass, h },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, mass, h }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const selectedPlanet = planets.find((planet) => planet.name === "Terre")!;
  const RT = selectedPlanet.radius;
  const w1 = h * h;
  const w2 = RT.measure.times(h);
  const w3 = RT.measure;
  tryToAddWrongProp(propositions, w1.toScientific(2).toTex());
  tryToAddWrongProp(propositions, w2.toSignificant(2).toTex());
  tryToAddWrongProp(propositions, w3.toSignificant(2).toTex());

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(100, 5000).toScientific(2).toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, h }) => {
  
  const validAnswer1 =
  
  return [
    answer,
    h.toScientific(2).toTex(),
    h.toScientific(3).toTex(),
    h.toScientific(1).toTex(),
  ].includes(ans);
};

export const gravitationalAttractionObjectHeight: Exercise<Identifiers> = {
  id: "gravitationalAttractionObjectHeight",
  connector: "=",
  label: "Calculer la hauteur d'un objet par rapport à la surface de la terre",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Mécanique gravitationnelle"],
  generator: (nb: number) =>
    getDistinctQuestions(getGravitationalAttractionObjectHeightQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
