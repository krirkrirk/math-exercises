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
import { MassUnit } from "#root/pc/units/massUnits";

type Identifiers = {
  planet: string;
  mass: number;
};

const getGravitationalAttractionValueQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const mass = randint(20, 900); // Masse de l'objet en grammes
  const selectedPlanet = planets.find((planet) => planet.name === "Terre")!; // Sélectionne la Terre

  const G = earthG.measure;
  const RT = selectedPlanet.radius.convert("m"); // Le rayon de la Terre en mètres
  const massKG = new Measure(mass, -3, MassUnit.kg); // Convertir en kilogrammes
  const massEarth = selectedPlanet.mass;
  const answerMeasure = G.times(massKG).times(massEarth).divide(RT.times(RT));
  const answer = answerMeasure.toTex({ scientific: 2 });

  const question: Question<Identifiers> = {
    answer,
    instruction: `On lance un objet de masse $${mass}\\ ${MassUnit.g.toTex()}$. Déterminer la valeur de la force d'attraction gravitationnelle exercée par la Terre sur cet objet (La hauteur $h$ de l'objet par rapport à la surface de la terre est négligeable).

Données : 
+ Rayon de la Terre : $R_T = ${selectedPlanet.radius.toTex({
      scientific: 2,
    })}$
+ Masse de la Terre : $m_T = ${selectedPlanet.mass.toTex({
      scientific: 2,
    })}$
+ $G = ${G.toTex({ scientific: 2 })}$`,
    keys: ["N", "timesTenPower"],
    answerFormat: "tex",
    identifiers: { planet: selectedPlanet.name, mass },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, mass }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const G = earthG.measure;
  const selectedPlanet = planets.find((planet) => planet.name === "Terre")!;
  const RT = selectedPlanet.radius;
  const massEarth = selectedPlanet.mass;
  const massKG = new Measure(mass, -3);
  tryToAddWrongProp(
    propositions,
    G.times(massKG)
      .times(massEarth)
      .divide(RT.times(RT))
      .toTex({ scientific: 2, hideUnit: true }) + "\\ \\text{N}",
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      round(randfloat(1, 20), 2).toTree().toTex() + "\\ \\text{N}",
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  if (ans === answer) return true;
  return [answer.replace("\\ N", "N"), answer.replace("\\ N", "")].includes(
    ans,
  );
};

export const gravitationalAttractionValue: Exercise<Identifiers> = {
  id: "gravitationalAttractionValue",
  connector: "=",
  label: "Calculer la force d'attraction gravitationnelle",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Mécanique gravitationnelle"],
  generator: (nb: number) =>
    getDistinctQuestions(getGravitationalAttractionValueQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
