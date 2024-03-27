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
import { frenchify } from "#root/math/utils/latex/frenchify";
import { randfloat } from "#root/math/utils/random/randfloat";
import { round } from "#root/math/utils/round";
import { earthGravity, moonGravity } from "#root/pc/constants/gravity";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  weight: number;
  originIsMoon: boolean;
};

const getWeightOnTheMoonQuestion: QuestionGenerator<Identifiers> = () => {
  const originIsMoon = coinFlip();
  const origin = originIsMoon ? "Lune" : "Terre";
  const destination = originIsMoon ? "Terre" : "Lune";
  const weight = round(randfloat(2, 30), 1);
  const gl = moonGravity.measure.toSignificant(1);
  const gt = earthGravity.measure.toSignificant(1);
  //Pt = m gt  = Pl/gl gt
  //Pl = m gl  = Pt/gt gl
  const answer =
    round(
      originIsMoon
        ? (weight / gl.evaluate()) * gt.evaluate()
        : (weight / gt.evaluate()) * gl.evaluate(),
      1,
    ) + "N";
  const question: Question<Identifiers> = {
    answer: frenchify(answer),
    instruction: `Un objet a un poids de $${weight.frenchify()}\\ \\text{N}$ sur la ${origin}. Quel est son poids sur la ${destination} ?
    
Données : $g_T = ${gt.toTex()}\\ ${
      earthGravity.unit
    }$ , $g_L = ${gl.toTex()}\\ ${moonGravity.unit}$
    `,
    keys: ["N"],
    answerFormat: "tex",
    identifiers: { weight, originIsMoon },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, originIsMoon, weight },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const gl = moonGravity.measure.toSignificant(1);
  const gt = earthGravity.measure.toSignificant(1);
  tryToAddWrongProp(
    propositions,
    round(
      !originIsMoon
        ? (weight / gl.evaluate()) * gt.evaluate()
        : (weight / gt.evaluate()) * gl.evaluate(),
      1,
    ).frenchify() + "N",
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      round(randfloat(2, 100), 1).frenchify() + "N",
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return [answer, answer.replace("N", "")].includes(ans);
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
