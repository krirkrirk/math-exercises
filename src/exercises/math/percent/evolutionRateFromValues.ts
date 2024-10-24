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
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { percentParser } from "#root/tree/parsers/percentParser";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { doWhile } from "#root/utils/doWhile";
import { alignTex } from "#root/utils/latex/alignTex";

type Identifiers = {
  vd: number;
  vf: number;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, vd, vf }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    getAnswer({
      vd: vf,
      vf: vd,
    }),
  );
  while (propositions.length < n) {
    const sign = vf > vd ? 1 : -1;
    tryToAddWrongProp(
      propositions,
      (sign * randfloat(1, 100, 2)).frenchify() + "\\%",
    );
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const taux = round(
    ((identifiers.vf - identifiers.vd) / identifiers.vd) * 100,
    2,
  );
  return taux.frenchify() + "\\%";
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  return `Un prix passe de $${identifiers.vd.frenchify()}€$ à $${identifiers.vf.frenchify()}€$. Quel est le taux d'évolution du prix, en pourcentage ? Arrondir au centième de pourcentage.`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `Si une valeur passe d'une valeur de départ $V_d$ à une valeur d'arrivée $V_a$, alors le taux d'évolution $t$ en pourcentage est donné par la formule : 
  
$$
t = \\frac{V_a-V_d}{V_d}\\times 100
$$`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const answer = getAnswer(identifiers);
  return `Si une valeur passe d'une valeur de départ $V_d$ à une valeur d'arrivée $V_a$, alors le taux d'évolution $t$ en pourcentage est donné par la formule : 
  
$$
t = \\frac{V_a-V_d}{V_d}\\times 100
$$

Ici, on a $V_d = ${identifiers.vd.frenchify()}$ et $V_a = ${identifiers.vf.frenchify()}$. 

Donc, le taux d'évolution est : 

${alignTex([
  [
    "t",
    "=",
    `\\frac{${identifiers.vf.frenchify()}-${identifiers.vd.frenchify()}}{${identifiers.vd.frenchify()}}\\times 100`,
  ],
  ["", "\\approx", answer],
])}
`;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["percent"];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return percentParser(ans) === answer;
};

const getEvolutionRateFromValuesQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const vd = coinFlip() ? randint(1, 100) : randfloat(1, 100, 2);
  const vf = doWhile(
    () => (coinFlip() ? randint(1, 100) : randfloat(1, 100, 2)),
    (x) => x === vd,
  );

  const identifiers: Identifiers = {
    vf,
    vd,
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

export const evolutionRateFromValues: Exercise<Identifiers> = {
  id: "evolutionRateFromValues",
  connector: "=",
  label: "Calculer un taux d'évolution",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getEvolutionRateFromValuesQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  ggbTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getAnswer,
  hasHintAndCorrection: true,
  getCorrection,
  getHint,
};
