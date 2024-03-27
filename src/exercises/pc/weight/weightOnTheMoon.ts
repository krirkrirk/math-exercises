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
import { round } from "#root/math/utils/round";
import { earthGravity, moonGravity } from "#root/pc/constants/gravity";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {};

const getWeightOnTheMoonQuestion: QuestionGenerator<Identifiers> = () => {
  const originIsMoon = coinFlip();
  const origin = originIsMoon ? "Lune" : "Terre";
  const destination = originIsMoon ? "Terre" : "Lune";
  const weight = round(randfloat(2, 30), 1);
  const gl = round(moonGravity.value, 1);
  const gt = round(earthGravity.value, 1);
  //Pt = m gt  = Pl/gl gt
  //Pl = m gl  = Pt/gt gl
  const answer = originIsMoon ? (weight / gl) * gt : (weight / gt) * gl;
  const question: Question<Identifiers> = {
    answer: answer + "",
    instruction: `Un objet a un poids de $${weight}\\ \\text{N}$ sur la ${origin}. Quel est son poids sur la ${destination} ?
    
Données : $g_T = ${gt}${earthGravity.unit}$ , $g_L = ${gl}${moonGravity.unit}$
    `,
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
export const weightOnTheMoon: Exercise<Identifiers> = {
  id: "weightOnTheMoon",
  connector: "=",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getWeightOnTheMoonQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
