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
import { frenchify } from "#root/math/utils/latex/frenchify";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { shuffle } from "#root/utils/alea/shuffle";

const refractionIndex = [
  { Material: "l'air", Material2: "d'air", Material3: "de l'air", n: 1 },
  { Material: "l'eau", Material2: "d'eau", Material3: "de l'eau", n: 1.33 },
  {
    Material: "l'Ethanol",
    Material2: "en Ethanol",
    Material3: "de l'Ethanol",
    n: 1.36,
  },
  {
    Material: "l'huile d'olive",
    Material2: "d'huile d'olive",
    Material3: "de l'huile d'olive",
    n: 1.47,
  },
  {
    Material: "la glace",
    Material2: "de glace",
    Material3: "de la glace",
    n: 1.31,
  },
  {
    Material: "le soda",
    Material2: "de soda",
    Material3: "du soda",
    n: 1.46,
  },
  {
    Material: "le plexiglas",
    Material2: "en plexiglas",
    Material3: "du plexiglas",
    n: 1.49,
  },
  {
    Material: "le verre crown",
    Material2: "en verre crown",
    Material3: "du verre crown",
    n: 1.52,
  },
  {
    Material: "le verre flint",
    Material2: "en verre flint",
    Material3: "du verre flint",
    n: 1.66,
  },
  {
    Material: "le diamant",
    Material2: "en diamant",
    Material3: "du diamant",
    n: 2.417,
  },
];
type Identifiers = {
  randomMaterial1: number;
  randomMaterial2: number;
  ramdonAngleIncidenceDeg: number;
};
const getSnellDescartes: QuestionGenerator<Identifiers> = () => {
  const randomMaterial1 = randint(0, refractionIndex.length - 1);
  const randomMaterial2 = randint(randomMaterial1 + 1, refractionIndex.length);

  const n1 = refractionIndex[randomMaterial1].n;
  const n2 = refractionIndex[randomMaterial2].n;
  const ramdonAngleIncidenceDeg = randint(10, 90);

  const instruction = `Un rayon de lumière se propage dans ${refractionIndex[randomMaterial1].Material} ($n1 \\approx ${n1}$) et atteint une surface ${refractionIndex[randomMaterial2].Material2}
  ($n2 \\approx ${n2}$) sous un angle d'incidence de $${ramdonAngleIncidenceDeg}$ degrés. $\\\\$ Calculer l'angle de
  réfraction de la lumière à l'intérieur ${refractionIndex[randomMaterial2].Material3} en utilisant la loi de Snell-Descartes.`;

  const angleIncidenceRad = (ramdonAngleIncidenceDeg * Math.PI) / 180;

  // Calculer l'angle de réfraction en radians
  const angleRefractionRad = Math.asin((n1 / n2) * Math.sin(angleIncidenceRad));

  // Convertir l'angle de réfraction de radians à degrés
  const angleRefractionDeg = (angleRefractionRad * 180) / Math.PI;
  const answer = `${frenchify(round(angleRefractionDeg, 1))}^{\\circ}`;
  const question: Question<Identifiers> = {
    instruction,
    answer,
    keys: ["sin", "arcsin", "degree"],
    answerFormat: "tex",
    identifiers: { ramdonAngleIncidenceDeg, randomMaterial1, randomMaterial2 },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      frenchify(round(randint(100, 900) / 10, 1)) + "^{\\circ}",
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const snellDescartes: Exercise<Identifiers> = {
  id: "snellDescartes",
  connector: "\\iff",
  label:
    "Utiliser la loi de Snell-Descartes pour calculer un angle de réfraction",
  levels: ["4ème", "3ème", "2nde"],
  sections: ["Lumière"],
  subject: "Physique",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getSnellDescartes, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
