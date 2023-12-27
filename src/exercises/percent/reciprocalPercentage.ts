import { randint } from "#root/math/utils/random/randint";
import { round } from "mathjs";
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
import { shuffle } from "#root/utils/shuffle";
type Identifiers = {};

const getReciprocalPercentageQuestion: QuestionGenerator<Identifiers> = () => {
  const randPercent = randint(1, 50);
  const tab = ["hausse", "baisse"];
  let ans = 0;
  let a = randint(0, 2);
  let instruction = `Le prix d'un article subit une ${tab[a]} de $${randPercent}\\%$. Quelle évolution devra-t-il subir pour revenir à son prix initial (arrondir au centième de pourcentage) ?`;

  ans =
    a == 0
      ? (1 / (1 + randPercent / 100) - 1) * 100
      : (1 / (1 - randPercent / 100) - 1) * 100;
  const answer = `${(ans > 0
    ? "+" + round(ans, 2)
    : "" + round(ans, 2)
  ).replace(".", ",")}\\%`;
  const question: Question<Identifiers> = {
    instruction,
    answer,
    keys: ["percent"],
    answerFormat: "tex",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    let wrongAnswer = Number(
      answer.replace(",", ".").replace("+", "").replace(`\\%`, ""),
    );
    const deviation = Math.random() < 0.5 ? -1 : 1;
    const percentDeviation = Math.random() * 20 + 1;

    wrongAnswer += deviation * percentDeviation;
    wrongAnswer = round(wrongAnswer, 2);
    tryToAddWrongProp(
      propositions,
      `${(wrongAnswer > 0 ? "+" + wrongAnswer : "" + wrongAnswer).replace(
        ".",
        ",",
      )} \\%`,
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const allowedTex = [answer];
  if (answer[0] === "+") allowedTex.push(answer.slice(1));
  return allowedTex.includes(ans);
};

export const reciprocalPercentage: MathExercise<Identifiers> = {
  id: "reciprocalPercentage",
  connector: "=",
  label: "Calculer un taux d'évolution réciproque",
  levels: ["2nde", "1rePro", "TermPro", "1reTech", "TermTech"],
  sections: ["Pourcentages"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getReciprocalPercentageQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
