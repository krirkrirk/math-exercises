import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { shuffle } from "#root/utils/shuffle";
import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../exercise";
import { getDistinctQuestions } from "../utils/getDistinctQuestions";

type Identifiers = {
  rate: number;
  nbMois: number;
};

const getAverageEvolutionRate: QuestionGenerator<Identifiers> = () => {
  const rate = randint(1, 100);
  const nbMois = randint(2, 13);

  const instruction = `Un prix augmente de $${rate}\\%$ en $${nbMois}$ mois. Quel est le taux d'évolution mensuel moyen (arrondir au centième de pourcentage) ?`;
  const answer = round((Math.pow(1 + rate / 100, 1 / nbMois) - 1) * 100, 2);
  const answerTex = (answer + "").replace(".", ",") + `\\%`;
  const question: Question<Identifiers> = {
    instruction,
    answer: answerTex,
    keys: ["percent"],
    answerFormat: "tex",
    identifiers: { nbMois, rate },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    let wrongAnswer = Number(answer.replace(",", ".").replace(`\\%`, ""));
    const deviation = Math.random() < 0.5 ? -1 : 1;
    const percentDeviation = Math.random() * 10 + 1;

    wrongAnswer += deviation * percentDeviation;
    wrongAnswer = round(wrongAnswer, 2);
    tryToAddWrongProp(
      propositions,
      `${(wrongAnswer + "").replace(".", ",")}\\%`,
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const allowedTex = [answer];
  allowedTex.push("+" + answer);
  return allowedTex.includes(ans);
};

export const averageEvolutionRate: MathExercise<Identifiers> = {
  id: "averageEvolutionRate",
  connector: "=",
  label: "Calculer un taux d'évolution moyen",
  levels: ["2nde", "1rePro", "TermPro", "1reTech", "TermTech"],
  sections: ["Pourcentages"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getAverageEvolutionRate, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
