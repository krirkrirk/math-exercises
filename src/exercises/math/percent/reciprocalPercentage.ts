import { randint } from "#root/math/utils/random/randint";
import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";
import { shuffle } from "#root/utils/shuffle";
import { coinFlip } from "#root/utils/coinFlip";
import { round } from "#root/math/utils/round";
type Identifiers = {
  randPercent: number;
  isUp: boolean;
};

const getReciprocalPercentageQuestion: QuestionGenerator<Identifiers> = () => {
  const randPercent = randint(1, 50);
  let ans = 0;
  const isUp = coinFlip();
  let instruction = `Le prix d'un article subit une ${
    isUp ? "hausse" : "baisse"
  } de $${randPercent}\\%$. Quelle évolution devra-t-il subir pour revenir à son prix initial (arrondir au centième de pourcentage) ?`;

  ans = isUp
    ? (1 / (1 + randPercent / 100) - 1) * 100
    : (1 / (1 - randPercent / 100) - 1) * 100;
  const answer = `${(ans > 0
    ? "+" + round(ans, 2)
    : "" + round(ans, 2)
  ).replace(".", ",")}\\%`;

  const cm = round(1 + (isUp ? randPercent / 100 : -randPercent / 100), 4);
  const recipCm = round(1 / cm, 4);
  const question: Question<Identifiers> = {
    instruction,
    answer,
    keys: ["percent"],
    answerFormat: "tex",
    identifiers: { isUp, randPercent },
    hint: `Calcule le coefficient multiplicateur associé à une ${
      isUp ? "hausse" : "baisse"
    } de $${randPercent}\\%$. Puis, calcule le coefficient multiplicateur réciproque : c'est l'inverse du coefficient multiplicateur. Il ne reste alors plus qu'à transformer le coefficient multiplicateur réciproque en taux d'évolution.`,
    correction: `Le coefficient multiplicateur correspondant à une ${
      isUp ? "hausse" : "baisse"
    } de $${randPercent}\\%$ est :
    
$1${isUp ? "+" : "-"}\\frac{${randPercent}}{100} = ${cm.frenchify()}$

Le coefficient multiplicateur réciproque est l'inverse du coefficient multiplicateur : 

$\\frac{1}{${cm.frenchify()}} = ${recipCm.frenchify()}$

On transforme ce coefficient multiplicateur en taux d'évolution : 

$(${recipCm.frenchify()}-1)\\times 100 = ${round(ans, 2).frenchify()}$.

Ainsi, le taux d'évolution permettant de revenir au prix initial est de $${answer}$.
    `,
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

export const reciprocalPercentage: Exercise<Identifiers> = {
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
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
