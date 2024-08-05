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
import {
  earthGravity,
  moonGravity,
} from "#root/pc/constants/mechanics/gravitational";
import { Measure } from "#root/pc/measure/measure";
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
    //hint: ` Pour calculer la masse de l'objet sur Terre, utiliser la formule : $m=\\frac{p_T}{g_T}$`,
    hint: "On rappelle que : $m=\\frac{p_T}{g_T}$ et  $m=\\frac{p_L}{g_L}$",
    correction: getCorrection(origin, weight, answer, gt, gl),
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

const getCorrection = (
  origin: string,
  weight: number,
  answer: string,
  gt: Measure,
  gl: Measure,
): string => {
  switch (origin) {
    case "Terre":
      return `1 . Trouver la masse de l'objet en utilisant son poids sur Terre $p_T$ et l'accélération due à la gravité terrestre $g_T$ : \n $m = \\frac{p_T}{g_T} \\Leftrightarrow m=${round(
        weight / gt.evaluate(),
        1,
      )}\\text{kg}$. \n \\
      2 . Utiliser la masse trouvée et l'accélération due à la gravité sur la Lune $g_L$ pour calculer le poids sur la Lune $p_L$ : $p_L = m \\ \\cdot g_L \\Leftrightarrow$ $p_L = ${frenchify(
        answer,
      )}$.`;
    case "Lune":
      return `1 . Trouver la masse de l'objet en utilisant son poids sur la Lune $p_L$ et l'accélération due à la gravité luanire $g_L$ : 
      $m = \\frac{p_L}{g_L} \\Leftrightarrow m=${round(
        weight / gl.evaluate(),
        1,
      )}\\text{kg}$. \n \\
      2 . Utiliser la masse trouvée et l'accélération due à la gravité sur la Terre $g_T$ pour calculer le poids sur la Terre $p_T$ : 
      $p_T = m \\ \\cdot g_T \\Leftrightarrow p_T = ${frenchify(answer)}$.`;
    default:
      return "";
  }
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return [answer, answer.replace("N", "")].includes(ans);
};
export const weightOnTheMoon: Exercise<Identifiers> = {
  id: "weightOnTheMoon",
  connector: "=",
  label: "Passer du poids sur la Lune au poids sur la Terre",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Forces"],
  generator: (nb: number) =>
    getDistinctQuestions(getWeightOnTheMoonQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
