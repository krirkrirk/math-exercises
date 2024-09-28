import {
  shuffleProps,
  Exercise,
  Proposition,
  Question,
  tryToAddWrongProp,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { probaLawFlip } from "#root/utils/probaLawFlip";
import { randomEnumValue } from "#root/utils/randomEnumValue";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { CardsColor, CardsValues } from "#root/exercises/utils/cardsData";

type Identifiers = {
  questionType: string;
};

const getCardBasicProbasQuestion: QuestionGenerator<Identifiers> = () => {
  const questionType = probaLawFlip<"oneCard" | "valueCard" | "colorCard">([
    ["oneCard", 0.33],
    ["valueCard", 0.33],
    ["colorCard", 0.33],
  ]);
  let answer = "";
  let target = "";
  let value: string;
  let color: CardsColor;
  switch (questionType) {
    case "oneCard":
      value = randomEnumValue(CardsValues);
      color = randomEnumValue(CardsColor);
      target = `${value === "dame" ? "une" : "un"} ${value} de ${color}`;
      answer = `\\frac{1}{52}`;
      break;
    case "valueCard":
      value = randomEnumValue(CardsValues);
      target = `${value === "dame" ? "une" : "un"} ${value}`;
      answer = "\\frac{1}{13}";
      break;
    case "colorCard":
      color = randomEnumValue(CardsColor);
      target = `un ${color}`;
      answer = `\\frac{1}{4}`;
      break;
  }

  const question: Question<Identifiers> = {
    answer,
    instruction: `On tire une carte dans un jeu de 52 cartes. Quelle est la probabilité d'obtenir ${target} ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: { questionType },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, questionType },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  switch (questionType) {
    case "colorCard":
      tryToAddWrongProp(propositions, "13");
      break;
    case "oneCard":
      tryToAddWrongProp(propositions, "1");
      break;
    case "valueCard":
      tryToAddWrongProp(propositions, "4");
      break;
  }

  while (propositions.length < n) {
    const wrongAnswer = new Rational(randint(1, 52), 52).simplify().tex;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { questionType }) => {
  let denum: number;
  switch (questionType) {
    case "oneCard":
      denum = 52;
      break;
    case "valueCard":
      denum = 13;
      break;
    case "colorCard":
      denum = 4;
      break;
    default:
      throw Error("wrong questionType in card Basic Probas");
  }
  const answer = new FractionNode(new NumberNode(1), new NumberNode(denum), {
    allowFractionToDecimal: true,
  });
  const texs = answer.toAllValidTexs();

  return texs.includes(ans);
};

export const cardBasicProbas: Exercise<Identifiers> = {
  id: "cardBasicProbas",
  connector: "=",
  label: "Calcul de probabilité simple avec un jeu de cartes",
  levels: ["5ème", "4ème", "3ème", "2ndPro", "2nde", "CAP"],
  isSingleStep: true,
  sections: ["Probabilités"],
  generator: (nb: number) =>
    getDistinctQuestions(getCardBasicProbasQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
