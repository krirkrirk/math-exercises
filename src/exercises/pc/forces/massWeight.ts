import { frenchify } from "#root/math/utils/latex/frenchify";
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
import { round } from "#root/math/utils/round";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  mass: number;
  force: number;
  target: "le poids" | "la masse";
};

const g = 9.81;

const getMassWeightQuestion: QuestionGenerator<Identifiers> = () => {
  const mass = round(randint(1, 1000), 2);
  const force = round(mass * g, 2);
  const target = coinFlip() ? "le poids" : "la masse";

  const instruction = `Un système qui pèse $${mass}\\ kg$ subit une force de $${frenchify(
    force,
  )}\\ N$ due à la gravité. Quel est ${target} de ce système ?`;

  const answer =
    target === "le poids"
      ? `${force.toTree().toTex()}`
      : `${mass.toTree().toTex()}`;

  const hint =
    target === "le poids"
      ? `Le poids est la force de gravité qui agit sur un objet. La formule est $P = m \\times g$, où $P$ est le poids en newtons (N), $m$ est la masse en kilogrammes (kg) et $g$ est l'accélération due à la gravité (environ $9.81\\ m/s^2$).`
      : `La masse est la quantité de matière dans un objet. La formule pour la trouver à partir du poids est $m = \\frac{P}{g}$, où $m$ est la masse en kilogrammes (kg), $P$ est le poids en newtons (N) et $g$ est l'accélération due à la gravité (environ $9.81\\ m/s^2$).`;

  const correction =
    target === "le poids"
      ? `Le poids est la force exercée par la gravité sur un objet. Donc ici, le poids est $${force
          .toTree()
          .toTex()}\\ N$.`
      : `La masse est la quantité de matière dans un objet. Donc ici, la masse est $${mass
          .toTree()
          .toTex()}\\ kg$.`;

  const question: Question<Identifiers> = {
    answer,
    instruction,
    hint,
    correction,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      mass,
      force,
      target,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, mass, force, target },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "tex");

  tryToAddWrongProp(propositions, mass.toTree().toTex());
  tryToAddWrongProp(propositions, force.toTree().toTex());
  tryToAddWrongProp(propositions, "Aucun des deux", "raw");

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const MassWeightExercise: Exercise<Identifiers> = {
  id: "massWeight",
  label: "Calculer le poids ou la masse d'un système",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Forces"],
  generator: (nb: number) => getDistinctQuestions(getMassWeightQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
