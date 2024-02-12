import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { coinFlip } from "#root/utils/coinFlip";
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
  randNbr: number;
  randPercent: number;
  isUp: boolean;
};

const getApplyPercentQuestion: QuestionGenerator<Identifiers> = () => {
  const randNbr = randint(1, 500);
  const randPercent = randint(1, 100);
  let instruction = "";
  let ans = "";
  let ansNb = 0;
  const isUp = coinFlip();
  if (isUp) {
    ansNb = round(randNbr * (1 + randPercent / 100), 2);
    ans = (ansNb + "").replace(".", ",");
    instruction = `Appliquer une hausse de $${randPercent}\\%$ à $${randNbr}$.`;
  } else {
    ansNb = round(randNbr * (1 - randPercent / 100), 2);
    ans = (ansNb + "").replace(".", ",");
    instruction = `Appliquer une baisse de $${randPercent}\\%$ à $${randNbr}$.`;
  }

  const answer = ans.toString();
  const question: Question<Identifiers> = {
    instruction,
    answer,
    keys: ["percent"],
    answerFormat: "tex",
    identifiers: { isUp, randNbr, randPercent },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const ansNb = Number(answer.replace(",", "."));
    const deviation = Math.random() < 0.5 ? -1 : 1;
    const percentDeviation = Math.random() * 20 + 1;

    let wrongAnswer = ansNb + deviation * (percentDeviation / 100) * ansNb;
    wrongAnswer = round(wrongAnswer, 2);
    tryToAddWrongProp(propositions, wrongAnswer.toString().replace(".", ","));
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const answerTree = new NumberNode(Number(answer.replace(",", ".")));
  const texs = answerTree.toAllValidTexs();
  return texs.includes(ans);
};

export const applyPercent: MathExercise<Identifiers> = {
  id: "applyPercent",
  connector: "=",
  label: "Appliquer un pourcentage d'augmentation ou de diminution",
  levels: [
    "4ème",
    "3ème",
    "2nde",
    "CAP",
    "2ndPro",
    "1rePro",
    "TermPro",
    "1reTech",
    "TermTech",
  ],
  sections: ["Pourcentages"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getApplyPercentQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
