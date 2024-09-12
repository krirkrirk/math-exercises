import {
  shuffleProps,
  Exercise,
  Proposition,
  Question,
  tryToAddWrongProp,
  QuestionGenerator,
  addValidProp,
  QCMGenerator,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  evolution: number;
};

const getEvolutionToCmQuestion: QuestionGenerator<Identifiers> = () => {
  const evolution = randint(-99, 101, [0]);
  const isHausse = evolution > 0;
  const CM = (round(1 + evolution / 100, 2) + "").replaceAll(".", ",");
  const answer = CM;

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Quel est le coefficient multiplicateur associé à une ${
      isHausse ? "hausse" : "baisse"
    } de $${isHausse ? evolution : evolution.toString().slice(1)}\\%$ ?`,
    keys: ["percent"],
    answerFormat: "tex",
    identifiers: { evolution },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, evolution },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(
    propositions,
    (round(evolution / 100, 2) + "").replaceAll(".", ","),
  );
  tryToAddWrongProp(propositions, evolution + "");

  while (propositions.length < n) {
    const wrongAnswer = (round(randint(1, 200) / 100, 2) + "").replaceAll(
      ".",
      ",",
    );
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const evolutionToCM: Exercise<Identifiers> = {
  id: "evolutionToCM",
  connector: "=",
  label: "Passer d'évolution en pourcentage au coefficient multiplicateur",
  levels: ["2ndPro", "2nde", "1rePro", "1reTech", "1reESM"],
  isSingleStep: true,
  sections: ["Pourcentages"],
  generator: (nb: number) => getDistinctQuestions(getEvolutionToCmQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
