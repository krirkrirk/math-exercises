import { randint } from "#root/math/utils/random/randint";
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
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { round } from "#root/math/utils/round";

type Identifiers = {
  evolutions: string[];
};

const getGlobalPercentQuestion: QuestionGenerator<Identifiers> = () => {
  const tab = ["hausse", "baisse"];
  let ans = 1;
  let instruction = "Le prix d'un article subit une ";
  const indice = randint(2, 4);
  const evolutions: string[] = [];
  for (let i = 0; i < indice; i++) {
    const randPercent = randint(1, 50);
    let a = randint(0, 2);
    instruction += `${tab[a]} de $${randPercent}\\%$`;
    evolutions.push((a === 0 ? "+" : "-") + randPercent);
    if (i + 1 < indice) instruction += ", puis une ";

    if (a == 0) ans *= 1 + randPercent / 100;
    else ans *= 1 - randPercent / 100;
  }

  ans = round((ans - 1) * 100, 2);

  instruction +=
    ". \nDéterminer le taux d'évolution global du prix de cet article (arrondir au centième de pourcentage).";
  const answer = `${(ans + "").replace(".", ",")}\\%`;

  const question: Question<Identifiers> = {
    instruction,
    answer,
    keys: ["percent"],
    answerFormat: "tex",
    identifiers: { evolutions },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    let wrongAnswer = Number(answer.replace(",", ".").replace(`\\%`, ""));
    const deviation = Math.random() < 0.5 ? -1 : 1;
    const percentDeviation = Math.random() * 20 + 1;

    wrongAnswer += deviation * percentDeviation;
    wrongAnswer = round(wrongAnswer, 2);
    tryToAddWrongProp(
      propositions,
      `${(wrongAnswer + "").replace(".", ",")} \\%`,
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const allowedTex = [answer];
  if (answer[0] !== "-") allowedTex.push("+" + answer);
  return allowedTex.includes(ans);
};

export const globalPercent: MathExercise<Identifiers> = {
  id: "globalPercent",
  connector: "=",
  label:
    "Calculer un taux d'évolution global à partir de taux d'évolution successifs",
  levels: ["2nde", "1rePro", "TermPro", "1reTech", "TermTech"],
  sections: ["Pourcentages"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getGlobalPercentQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
