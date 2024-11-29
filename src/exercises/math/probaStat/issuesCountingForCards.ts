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
import { randint } from "#root/math/utils/random/randint";
import { probaLawFlip } from "#root/utils/alea/probaLawFlip";
import { random } from "#root/utils/alea/random";
import { randomEnumValue } from "#root/utils/alea/randomEnumValue";
import { CardsColor, CardsValues } from "../../utils/cardsData";

type Identifiers = {
  questionType: string;
  value?: string;
  color?: string;
};

const getIssuesCountingForCardsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const questionType = probaLawFlip<
    "oneCard" | "valueCard" | "colorCard" | "suitCard"
  >([
    ["oneCard", 0.25],
    ["valueCard", 0.25],
    ["suitCard", 0.25],
    ["colorCard", 0.25],
  ]);
  let answer = "";
  let target = "";
  let value: string | undefined;
  let color: string | undefined;
  switch (questionType) {
    case "oneCard":
      value = randomEnumValue(CardsValues);
      color = randomEnumValue(CardsColor);
      target = `${value === "dame" ? "une" : "un"} ${value} de ${color}`;
      answer = `1`;
      break;
    case "valueCard":
      value = randomEnumValue(CardsValues);
      target = `${value === "dame" ? "une" : "un"} ${value}`;
      answer = "4";
      break;
    case "colorCard":
      color = random(["rouge", "noire"]);
      target = `une carte ${color}`;
      answer = `26`;
      break;
    case "suitCard":
      color = randomEnumValue(CardsColor);
      target = `un ${color}`;
      answer = `13`;
      break;
  }

  const question: Question<Identifiers> = {
    answer,
    instruction: `On tire une carte dans un jeu de 52 cartes. Combien l'événement $A = $ "obtenir ${target}" compte-t-il d'issues ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: { questionType, value, color },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, "1");
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(0, 52) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const issuesCountingForCards: Exercise<Identifiers> = {
  id: "issuesCountingForCards",
  connector: "=",
  label: "Compter le nombre d'issues d'un événement avec un jeu de cartes",
  levels: ["3ème", "2nde", "2ndPro", "1rePro"],
  isSingleStep: true,
  sections: ["Probabilités"],
  generator: (nb: number) =>
    getDistinctQuestions(getIssuesCountingForCardsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
