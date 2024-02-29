import {
  shuffleProps,
  MathExercise,
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
  isFromEvolutionToCM: boolean;
  evolution: number;
};

const getEvolutionToCmQuestion: QuestionGenerator<Identifiers> = () => {
  const isFromEvolutionToCM = coinFlip();
  const evolution = randint(-99, 101, [0]);
  const isHausse = evolution > 0;
  const CM = (round(1 + evolution / 100, 2) + "").replaceAll(".", ",");
  const answer = isFromEvolutionToCM
    ? CM
    : (isHausse ? "+" : "") + evolution + "\\%";

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: isFromEvolutionToCM
      ? `Quel est le coefficient multiplicateur associé à une ${
          isHausse ? "hausse" : "baisse"
        } de $${isHausse ? evolution : evolution.toString().slice(1)}\\%$ ?`
      : `Quelle est l'évolution en pourcentage associée à un coefficient multiplicateur de $${CM}$ ?`,
    keys: ["percent"],
    answerFormat: "tex",
    identifiers: { isFromEvolutionToCM, evolution },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, isFromEvolutionToCM, evolution },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  if (isFromEvolutionToCM) {
    tryToAddWrongProp(
      propositions,
      (round(evolution / 100, 2) + "").replaceAll(".", ","),
    );
    tryToAddWrongProp(propositions, evolution + "");
  } else {
    tryToAddWrongProp(
      propositions,
      "+" + (round(1 + evolution / 100, 2) * 100 + "\\%").replaceAll(".", ","),
    );
  }
  while (propositions.length < n) {
    const wrongAnswer = isFromEvolutionToCM
      ? (round(randint(1, 200) / 100, 2) + "").replaceAll(".", ",")
      : (coinFlip() ? "+" : "-") + randint(1, 100) + "\\%";
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const allowedTex = [answer];
  if (answer[0] === "+") allowedTex.push(answer.slice(1));
  return allowedTex.includes(ans);
};

export const evolutionToCM: MathExercise<Identifiers> = {
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
};
