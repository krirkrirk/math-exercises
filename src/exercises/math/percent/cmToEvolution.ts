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
import { alignTex } from "#root/utils/latex/alignTex";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  evolution: number;
};

const getCmToEvolutionQuestion: QuestionGenerator<Identifiers> = () => {
  const evolution = randint(-99, 101, [0]);
  const isHausse = evolution > 0;
  const CM = (round(1 + evolution / 100, 2) + "").replaceAll(".", ",");
  const answer = (isHausse ? "+" : "") + evolution + "\\%";

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Quelle est l'évolution en pourcentage associée à un coefficient multiplicateur de $${CM}$ ?`,
    keys: ["percent"],
    answerFormat: "tex",
    identifiers: { evolution },
    hint: "Pour trouver le taux d'évolution $t$ à partir du coefficient multiplicateur (CM) utilise la formule $t = \\left(\\text{CM}-1\\right)\\times 100$.",
    correction: `Le taux d'évolution $t$ s'obtient par la formule 
    
$$
t = \\left(\\text{CM}-1\\right)\\times 100
$$

Ici, on a donc : 

${alignTex([
  ["t", "=", `\\left(${CM}-1\\right)\\times 100`],
  ["", "=", evolution + ""],
])}
    
Le taux d'évolution est donc de $${answer}$.
    `,
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
    "+" + (round(1 + evolution / 100, 2) * 100 + "\\%").replaceAll(".", ","),
  );

  while (propositions.length < n) {
    const wrongAnswer = (coinFlip() ? "+" : "-") + randint(1, 100) + "\\%";
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const allowedTex = [answer, answer.replace("\\%", "")];
  if (answer[0] === "+") {
    allowedTex.push(answer.slice(1));
    allowedTex.push(answer.slice(1).replace("\\%", ""));
  }
  return allowedTex.includes(ans);
};

export const cmToEvolution: Exercise<Identifiers> = {
  id: "cmToEvolution",
  connector: "=",
  label: "Passer de coefficient multiplicateur à évolution en pourcentage",
  levels: ["2ndPro", "2nde", "1rePro", "1reTech", "1reESM"],
  isSingleStep: true,
  sections: ["Pourcentages"],
  generator: (nb: number) => getDistinctQuestions(getCmToEvolutionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
