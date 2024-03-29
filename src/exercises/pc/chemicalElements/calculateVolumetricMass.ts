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

type Identifiers = {};

// m = t*v où t = concentration
const getCalculateVolumetricMassQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const type = randint(1, 4);
  let m = 0;
  let t = 0;
  let v = 0;
  let instruction = "";
  let answer = "";
  switch (type) {
    case 1:
      //find t
      m = randfloat(50, 400, 1);
      v = randfloat(50, 400, 1);
      answer = round(m / v, 1).frenchify();
      instruction = `Un liquide de volume $${v.frenchify()}\\ \\text{mL}$ a une masse de $${m.frenchify()}\\ \\text{g}$. Quel est la masse volumique de ce liquide, en $\\text{g}\\cdot\\text{mL}^{-1}$ ?`;
      break;
    case 2:
      //find m
      t = randfloat(1, 20, 1);
      v = randfloat(50, 400, 1);
      answer = round(t * v, 1).frenchify();
      instruction = `Un liquide de volume $${v.frenchify()}\\ \\text{mL}$ a une masse volumique de $${t.frenchify()}\\ \\text{g}\\cdot\\text{mL}^{-1}$. Quel est la masse de ce liquide, en $\\text{g}$ ?`;
      break;
    case 3:
      //find v
      t = randfloat(1, 20, 1);
      m = randfloat(50, 400, 1);
      answer = round(m / t, 1).frenchify();
      instruction = `Un liquide de masse $${m.frenchify()}\\ \\text{g}$ a une masse volumique de $${t.frenchify()}\\ \\text{g}\\cdot\\text{mL}^{-1}$. Quel est le volume de ce liquide, en $\\text{mL}$ ?`;
      break;
      break;
  }

  //un lique de volume v a une masse volumique de t, calculer m
  //un liquide d'un volume de v a une masse de m, calculer t
  const question: Question<Identifiers> = {
    answer,
    instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { m, t, v },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(1, 50, 1).frenchify());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const calculateVolumetricMass: Exercise<Identifiers> = {
  id: "calculateVolumetricMass",
  connector: "=",
  label: "Utiliser la formule $m = t\\times V$",
  levels: ["2nde"],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getCalculateVolumetricMassQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
