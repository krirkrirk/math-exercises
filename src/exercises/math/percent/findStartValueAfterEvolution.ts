import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  GetGGBOptions,
  GetStudentGGBOptions,
  GetGGBAnswer,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randfloat } from "#root/math/utils/random/randfloat";
import { round } from "#root/math/utils/round";
import { euroParser } from "#root/tree/parsers/euroParser";
import { alignTex } from "#root/utils/latex/alignTex";

type Identifiers = {
  vf: number;
  percentRate: number;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, percentRate, vf },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const invCm = 1 - percentRate / 100;

  tryToAddWrongProp(propositions, round(vf * invCm, 2).frenchify());
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, round(randfloat(1, 100, 2), 2).frenchify());
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const cm = 1 + identifiers.percentRate / 100;
  const vd = round(identifiers.vf / cm, 2);
  return vd.frenchify();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const evolution = identifiers.percentRate < 0 ? "baisse" : "hausse";
  return `Après une ${evolution} de $${identifiers.percentRate.frenchify()}\\%$, le prix d'un objet est de $${identifiers.vf.frenchify()}€$. Quel était son prix initial ? Arrondir au centième.`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `Transforme le taux d'évolution en coefficient multiplicateur. Puis, divise le prix final par ce coefficient multiplicateur.`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const evolution = identifiers.percentRate < 0 ? "baisse" : "hausse";
  const answer = getAnswer(identifiers);
  const cm = round(1 + identifiers.percentRate / 100, 4);

  return `Le coefficient multiplicateur associé à une ${evolution} de $${identifiers.percentRate.frenchify()}\\%$ est : 
  

${alignTex([
  ["CM", "=", "1+\\frac{t}{100}"],
  ["", "=", `1+\\frac{${identifiers.percentRate.frenchify()}}{100}`],
  ["", "=", cm.frenchify()],
])}


Si on note $V_d$ la valeur de départ et $V_a$ la valeur d'arrivée, alors on sait que :

$$
V_d\\times CM = V_a
$$

Donc, pour trouver $V_d$, il faut diviser $V_a$ par le coefficient multiplicateur : 

${alignTex([
  ["V_d", "=", `\\frac{${identifiers.vf.frenchify()}}{${cm.frenchify()}}`],
  ["", "\\approx", answer],
])}
  `;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return euroParser(ans) === answer + "€";
};

const getFindStartValueAfterEvolutionQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const vf = randfloat(1, 100, 2);
  const percentRate = randfloat(-100, 100, 2, [0]);
  const identifiers: Identifiers = {
    vf,
    percentRate,
  };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
  };

  return question;
};

export const findStartValueAfterEvolution: Exercise<Identifiers> = {
  id: "findStartValueAfterEvolution",
  connector: "=",
  label:
    "Retrouver un prix initial à partir du prix final et du taux d'évolution",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getFindStartValueAfterEvolutionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  ggbTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getAnswer,
  getCorrection,
  getHint,
  hasHintAndCorrection: true,
};
