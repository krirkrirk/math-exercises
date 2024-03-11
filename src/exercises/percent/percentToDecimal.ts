import {
  MathExercise,
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
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  isPercentToDecimal: boolean;
  nb: number;
};

const getPercentToDecimalQuestion: QuestionGenerator<Identifiers> = () => {
  const isPercentToDecimal = coinFlip();
  const nb = DecimalConstructor.random(0, 2);
  const tex = nb.toTree().toTex();
  const percentTex = nb.toPercentNode().toTex();
  const instru = isPercentToDecimal ? percentTex : tex;
  const answer = isPercentToDecimal ? tex : percentTex;
  const question: Question<Identifiers> = {
    answer,
    instruction: `Ecrire le nombre suivant ${
      isPercentToDecimal
        ? "sous forme de nombre décimal"
        : "sous forme de pourcentage"
    } : $${instru}$`,
    keys: ["percent"],
    answerFormat: "tex",
    identifiers: { isPercentToDecimal, nb: nb.value },
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
    const texs = dec.toPercentNode().toAllValidTexs();
    return texs.includes(ans);
  }
};
export const percentToDecimal: MathExercise<Identifiers> = {
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
};
