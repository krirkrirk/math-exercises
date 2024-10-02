import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import {
  Decimal,
  DecimalConstructor,
} from "#root/math/numbers/decimals/decimal";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";

/**
 * arrondi à l'unité
 */

const ranks = ["unité", "dixième", "centième", "millième", "dix millième"];
const ranksWithAu = ["à l'unité", "au dixième", "au centième", "au millième"];
const instructions = [
  "Arrondir à l'unité :",
  "Arrondir au dixième :",
  "Arrondir au centième :",
  "Arrondir au millième :",
];

const getRoundQuestions: QuestionGenerator<
  Identifiers,
  { precisionAsked: number }
> = (opts) => {
  const precisionAsked = opts?.precisionAsked || 0;
  const precision = randint(precisionAsked + 1, precisionAsked + 5);
  const dec = DecimalConstructor.random(0, 1000, precision);
  const decTex = dec.toTree().toTex();
  const answer = dec.round(precisionAsked).toTree().toTex();
  const figureToLookAt = dec.getDigitAtRank(-(precisionAsked + 1));
  const question: Question<Identifiers> = {
    instruction: `${instructions[precisionAsked]} $${decTex}$`,
    startStatement: decTex,
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      precisionAsked,
      decimal: dec.value,
      precision,
    },
    hint: `Pour arrondir ${
      ranksWithAu[precisionAsked]
    }, on regarde le chiffre des ${
      ranks[precisionAsked + 1]
    }s. S'il est inférieur à $5$, on arrondit ${
      ranksWithAu[precisionAsked]
    } inférieur. S'il est supérieur à $5$, on arrondit ${
      ranksWithAu[precisionAsked]
    } supérieur.`,
    correction: `Le chiffre des ${
      ranks[precisionAsked + 1]
    }s est $${figureToLookAt}$. 
    
${
  figureToLookAt < 5
    ? `Puisque ${figureToLookAt} est inférieur à $5, on arrondit ${ranksWithAu[precisionAsked]} inférieur. 
     
Ainsi, en arrondissant ${ranksWithAu[precisionAsked]}, on a $${decTex} \\approx ${answer}$`
    : `Puisque ${figureToLookAt} est supérieur à $5$, on arrondit ${ranksWithAu[precisionAsked]} supérieur. 
     
Ainsi, en arrondissant ${ranksWithAu[precisionAsked]}, on a 

$$
${decTex} \\approx ${answer}
$$`
}`,
  };
  return question;
};

type Identifiers = {
  precisionAsked: number;
  decimal: number;
  precision: number;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, precisionAsked, decimal, precision },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const dec = new Decimal(decimal);

  tryToAddWrongProp(
    propositions,
    round(dec.value, precisionAsked) ===
      round(dec.value + 0.5 * 10 ** -precisionAsked, precisionAsked)
      ? round(dec.value - 0.5 * 10 ** -precisionAsked, precisionAsked)
          .toString()
          .replace(".", ",")
      : round(dec.value + 0.5 * 10 ** -precisionAsked, precisionAsked)
          .toString()
          .replace(".", ","),
  );
  tryToAddWrongProp(propositions, dec.toTree().toTex());

  if (dec.decimalPart.length !== precisionAsked + 1)
    tryToAddWrongProp(
      propositions,
      dec
        .round(precisionAsked + 1)
        .toTree()
        .toTex(),
    );

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      DecimalConstructor.random(0, 1000, precision).toTree().toTex(),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { decimal, precisionAsked }) => {
  const dec = new Decimal(decimal);
  const answer = dec.round(precisionAsked).toTree();
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};
export const roundToUnit: Exercise<Identifiers> = {
  id: "roundToUnit",
  connector: "\\approx",
  label: "Arrondir à l'unité",
  levels: ["6ème", "5ème", "CAP", "2ndPro", "1rePro"],
  sections: ["Calculs"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(() => getRoundQuestions({ precisionAsked: 0 }), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
/**
 * arrondi à l'unité
 */
export const roundToDixieme: Exercise<Identifiers> = {
  id: "roundToDixieme",
  connector: "\\approx",
  label: "Arrondir au dixième",
  levels: ["6ème", "5ème", "CAP", "2ndPro", "1rePro"],
  sections: ["Calculs"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(() => getRoundQuestions({ precisionAsked: 1 }), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
/**
 * arrondi à l'unité
 */
export const roundToCentieme: Exercise<Identifiers> = {
  id: "roundToCentieme",
  connector: "\\approx",
  label: "Arrondir au centième",
  levels: ["6ème", "5ème", "CAP", "2ndPro", "1rePro"],
  sections: ["Calculs"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(() => getRoundQuestions({ precisionAsked: 2 }), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
/**
 * arrondi à l'unité
 */
export const roundToMillieme: Exercise<Identifiers> = {
  id: "roundToMillieme",
  connector: "\\approx",
  label: "Arrondir au millième",
  levels: ["6ème", "5ème", "CAP", "2ndPro", "1rePro"],
  sections: ["Calculs"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(() => getRoundQuestions({ precisionAsked: 3 }), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};

export const allRoundings: Exercise<Identifiers> = {
  id: "allRoundings",
  connector: "\\approx",
  label: "Arrondir un nombre décimal",
  levels: ["6ème", "5ème", "CAP", "2ndPro", "1rePro"],
  sections: ["Calculs"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(
      () => getRoundQuestions({ precisionAsked: randint(0, 4) }),
      nb,
    ),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
