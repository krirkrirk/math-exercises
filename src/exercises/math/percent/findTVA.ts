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
import { numberParser } from "#root/tree/parsers/numberParser";
import { coinFlip } from "#root/utils/coinFlip";
import { alignTex } from "#root/utils/latex/alignTex";
import { random } from "#root/utils/random";

type Identifiers = {
  ttc: number;
  ht: number;
  tva: number;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, "20\\%");
  tryToAddWrongProp(propositions, "10\\%");
  tryToAddWrongProp(propositions, "5,5\\%");
  tryToAddWrongProp(propositions, "2,1\\%");

  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = ({ ht, ttc, tva }) => {
  return tva.frenchify() + "\\%";
};

const getInstruction: GetInstruction<Identifiers> = ({ ht, ttc }) => {
  return `Le prix HT d'un objet est $${ht.frenchify()}€$ et son prix TTC est $${ttc.frenchify()}€$. Quel est le taux de TVA ? (arrondir au centième de pourcentage)`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `Le taux de TVA est donnée par : 
  
$$
\\frac{\\text{Prix TTC}-\\text{Prix HT}}{\\text{Prix HT}}\\times 100
$$`;
};
const getCorrection: GetCorrection<Identifiers> = ({ ht, ttc, tva }) => {
  return `Le taux de TVA est : 
  
${alignTex([
  ["", "\\frac{\\text{Prix TTC}-\\text{Prix HT}}{\\text{Prix HT}}\\times 100"],
  [
    "=",
    `\\frac{${ttc.frenchify()}-${ht.frenchify()}}{${ht.frenchify()}}{}\\times 100`,
  ],
  ["\\approx", tva.frenchify()],
])}

Le taux de TVA est donc de $${tva.frenchify()}\\%$.
`;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["percent"];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const nb = numberParser(ans.replace("\\%", ""));
  return nb + "\\%" === answer;
};

const getFindTvaQuestion: QuestionGenerator<Identifiers> = () => {
  const tva = random([2.1, 5.5, 10, 20]);
  const ht = coinFlip() ? randint(5, 200) : randfloat(5, 200, 2);
  const ttc = round(ht * (1 + tva / 100), 2);
  const identifiers: Identifiers = { ht, tva, ttc };
  //20, 10, 5.5, 2.1
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

export const findTVA: Exercise<Identifiers> = {
  id: "findTVA",
  connector: "=",
  label: "Retrouver le taux de TVA à partir des prix HT et TTC",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getFindTvaQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  ggbTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getHint,
  getCorrection,
  getAnswer,
  hasHintAndCorrection: true,
};
