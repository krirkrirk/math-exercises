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
  const h = randint(1500, 9000); // La hauteur de l'objet en kilomètres
  const height = new Measure(h, 3);
  const d = height.add(RT);
  const massKG = new Measure(mass, 0); // Convertir en kilogrammes
  const massEarth = selectedPlanet.mass;
  const force = G.times(massKG).times(massEarth.measure).divide(d.times(d));
  const answer = h.toScientific(2).toTex();

  const instruction = `On lance un objet de masse $${mass}\\ \\text{kg}$. \n Déterminer la hauteur de cet objet par rapport à la surface de la Terre en $\\text{km}$, à partir de la valeur de la force d'attraction gravitationnelle. (Format de la réponse : Écriture scientifique avec 2 chiffres après la virgule)

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
+ $G = ${G.toTex({ scientific: 2 })}\\ ${earthG.unit}$`;

  const hint = `La force d'attraction gravitationnelle entre deux masses est donnée par la loi universelle de la gravitation :
  $$F = G \\cdot \\frac{m_1 \\cdot m_2}{d^2}$$
  où:
  - $F$ est la force d'attraction gravitationnelle
  - $G$ est la constante gravitationnelle
  - $m_1$ et $m_2$ sont les masses des deux objets
  - $d$ est la distance entre les centres des deux masses.

  Réorganisez cette formule pour isoler la hauteur $h$ à partir de la force $F$ mesurée.`;

  const correction = `Pour trouver la hauteur $h$, nous réorganisons la loi de la gravitation :
  $$F = G \\cdot \\frac{m_1 \\cdot m_2}{(R_T + h)^2}$$
  où:
  - $F = ${force.toSignificant(2).toTex()}\\ N$
  - $G = ${G.toTex({ scientific: 2 })}\\ ${earthG.unit}$
  - $m_1 = ${mass}\\ \\text{kg}$
  - $m_2 = ${selectedPlanet.mass.measure.toTex({
    scientific: 2,
  })}\\ ${selectedPlanet.mass.unit}$
  - $R_T = ${selectedPlanet.radius.measure.toTex({
    scientific: 2,
  })}\\ ${selectedPlanet.radius.unit}$

  Nous devons convertir le rayon de la Terre $R_T$ en mètres pour le calcul en utilisant le Système International d'Unités (SI).

  Nous résolvons pour $h$ :
  $$h = \\sqrt{\\frac{G \\cdot m_1 \\cdot m_2}{F}} - R_T$$

  En appliquant les valeurs, nous obtenons :
  $$h = \\sqrt{\\frac{${G.toTex({
    scientific: 2,
  })} \\cdot ${mass} \\cdot ${selectedPlanet.mass.measure.toTex({
    scientific: 2,
  })}}{${force.toSignificant(2).toTex()}}} - ${selectedPlanet.radius.measure
    .times(1000)
    .toTex({
      scientific: 2,
    })}$$

  Après simplification, la hauteur $h$ est approximativement :
  $$h \\approx ${answer}\\ \\text{km}$$`;

  const question: Question<Identifiers> = {
    answer,
    instruction,
    hint,
    correction,
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
    tryToAddWrongProp(
      propositions,
      randint(1500, 9000).toScientific(2).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, h }) => {
  const height = new Measure(h * 0.001, 3);
  const validanswer1 = new Measure(height.significantPart + 0.01, 3);
  const validanswer2 = new Measure(height.significantPart - 0.01, 3);
  const validanswer3 = new Measure(height.significantPart - 0.01, 3);
  const validanswer4 = new Measure(height.significantPart + 0.02, 3);
  let latexs = [
    answer,
    h.toScientific(2).toTex(),
    validanswer1.toSignificant(2).toTex(),
    validanswer4.toSignificant(2).toTex(),
    validanswer2.toSignificant(2).toTex(),
    validanswer3.toSignificant(2).toTex(),
  ];
  console.log(latexs);
  return latexs.includes(ans);
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
