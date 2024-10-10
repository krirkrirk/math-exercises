import {
  Exercise,
  GetAnswer,
  GetCorrection,
  GetHint,
  GetInstruction,
  GetKeys,
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
import {
  Decimal,
  DecimalConstructor,
} from "#root/math/numbers/decimals/decimal";
import {
  Integer,
  IntegerConstructor,
} from "#root/math/numbers/integer/integer";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { numberParser } from "#root/tree/parsers/numberParser";
import { coinFlip } from "#root/utils/coinFlip";
import { probaFlip } from "#root/utils/probaFlip";

type Identifiers = {
  isPercentToDecimal: boolean;
  nb: number;
};

const getAnswer: GetAnswer<Identifiers> = ({ nb, isPercentToDecimal }) => {
  const dec = new Decimal(nb);
  const tex = dec.toTree().toTex();
  const percentTex = dec.toPercentNode().toTex();
  return isPercentToDecimal ? tex : percentTex;
};

const getInstruction: GetInstruction<Identifiers> = ({
  isPercentToDecimal,
  nb,
}) => {
  const dec = new Decimal(nb);
  const tex = dec.toTree().toTex();
  const percentTex = dec.toPercentNode().toTex();
  const instru = isPercentToDecimal ? percentTex : tex;
  return `Ecrire le nombre suivant ${
    isPercentToDecimal
      ? "sous forme de nombre décimal"
      : "sous forme de pourcentage"
  } : $${instru}$`;
};

const getHint: GetHint<Identifiers> = ({ isPercentToDecimal }) => {
  return `${
    isPercentToDecimal
      ? `Pour écrire $x\\%$ en décimal, rappelle toi que $x\\% = \\frac{x}{100}$.`
      : `Pour écrire un nombre $x$ en pourcentage, on multiplie $x$ par $100$.`
  }`;
};
const getCorrection: GetCorrection<Identifiers> = ({
  isPercentToDecimal,
  nb,
}) => {
  const answer = getAnswer({ isPercentToDecimal, nb });
  const nbPercent = round(nb * 100, 10).frenchify();
  return `${
    isPercentToDecimal
      ? `Le symbole $\\%$ signifie simplement "divisé par $100$". 

On a donc $${nbPercent}\\% = \\frac{${nbPercent}}{100} = ${answer}$
    `
      : `Pour écrire un nombre sous la forme d'un pourcentage, il suffit de le multiplier par $100$. 
    
On a donc $${nb.frenchify()} = ${answer}$.

En effet, on a bien $${answer} = \\frac{${answer.replace(
          "\\%",
          "",
        )}}{100} = ${nb.frenchify()}$.`
  }`;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["percent"];
};
const getPercentToDecimalQuestion: QuestionGenerator<Identifiers> = () => {
  const isPercentToDecimal = coinFlip();
  const isNatural = coinFlip();
  const percentNb = probaFlip(0.3)
    ? isNatural
      ? new Integer(IntegerConstructor.random(1, [0]))
      : DecimalConstructor.random(0, 10)
    : coinFlip()
    ? isNatural
      ? new Integer(IntegerConstructor.random(2))
      : DecimalConstructor.random(10, 100)
    : isNatural
    ? new Integer(IntegerConstructor.random(3))
    : DecimalConstructor.random(100, 200);

  const nb = percentNb.times(0.01);

  const identifiers = {
    isPercentToDecimal,
    nb: nb.value,
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

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, isPercentToDecimal, nb },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const dec = new Decimal(nb);
  while (propositions.length < n) {
    if (isPercentToDecimal) {
      tryToAddWrongProp(
        propositions,
        dec
          .multiplyByPowerOfTen(randint(-4, 4, [0, 1]))
          .toTree()
          .toTex(),
      );
    } else {
      tryToAddWrongProp(
        propositions,
        dec
          .multiplyByPowerOfTen(randint(-4, 4, [0, 1]))
          .toPercentNode()
          .toTex(),
      );
    }
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, isPercentToDecimal, nb },
) => {
  const dec = new Decimal(nb);
  if (isPercentToDecimal) {
    return ans === answer;
  } else {
    const rawAns = ans.replace("\\%", "");
    const parsed = numberParser(rawAns);
    if (!parsed) return false;
    return parsed + "\\%" === answer;
  }
};
export const percentToDecimal: Exercise<Identifiers> = {
  id: "percentToDecimal",
  connector: "=",
  label: "Ecrire un pourcentage sous forme décimal et vice-versa",
  levels: ["2nde", "2ndPro", "1reESM", "1rePro"],
  isSingleStep: true,
  sections: ["Pourcentages"],
  generator: (nb: number) =>
    getDistinctQuestions(getPercentToDecimalQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
