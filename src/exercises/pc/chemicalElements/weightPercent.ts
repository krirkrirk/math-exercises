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
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";

type Identifiers = {
  totalWeight: number;
  percent: number;
  elWeight: number;
  type: number;
};

//m_A = m * P_A
const getWeightPercentQuestion: QuestionGenerator<Identifiers> = () => {
  // const totalWeight = round(randfloat(1, 100), 1);
  // const percent = round(randfloat(1, 100), 1);
  // const elWeight = round((totalWeight * percent) / 100, 1);
  let percent = 0;
  let totalWeight = 0;
  let elWeight = 0;
  const type = randint(1, 4);
  let instruction = "";
  let answer = "";

  switch (type) {
    case 1:
      percent = round(randfloat(1, 90), 1);
      elWeight = round(randfloat(1, 100), 1);
      totalWeight = round((100 * elWeight) / percent, 1);
      instruction = `Dans un mélange, une espèce chimique $A$ a un pourcentage massique de $P_m(A) = ${percent.frenchify()}\\%$ et sa masse dans ce mélange est $${elWeight.frenchify()}\\ \\text{g}$. Quelle est la masse totale du mélange ?`;
      answer = totalWeight.frenchify() + "g";
      break;
    case 2:
      totalWeight = round(randfloat(30, 200), 1);
      percent = round(randfloat(1, 90), 1);
      elWeight = round((percent * totalWeight) / 100, 1);
      instruction = `Dans un mélange de masse $${totalWeight.frenchify()}\\ \\text{g}$, une espèce chimique $A$ a un pourcentage massique de $P_m(A) = ${percent.frenchify()}\\%$. Quelle est la masse de l'espèce chimique dans le mélange ?`;
      answer = elWeight.frenchify() + "g";
      break;

    case 3:
      totalWeight = round(randfloat(30, 200), 1);
      elWeight = round(randfloat(1, totalWeight - 10), 1);
      percent = round((elWeight / totalWeight) * 100, 1);
      instruction = `Dans un mélange de masse $${totalWeight.frenchify()}\\ \\text{g}$, une espèce chimique $A$ a une masse de $${elWeight.frenchify()}\\ \\text{g}$. Quel est le pourcentage massique $P_m(A)$ de l'espèce $A$ dans ce mélange ?`;
      answer = percent.frenchify() + "\\%";
      break;
  }

  const question: Question<Identifiers> = {
    answer,
    instruction,
    keys: ["percent", "g"],
    answerFormat: "tex",
    identifiers: { elWeight, type, percent, totalWeight },
  };

  return question;
};

//m_A = P_A*m
const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, type, elWeight, percent, totalWeight },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  switch (type) {
    case 1:
      //total
      tryToAddWrongProp(
        propositions,
        round(percent / (elWeight * 100), 1).frenchify() + "g",
      );
      break;
    case 2:
      //el
      tryToAddWrongProp(
        propositions,
        round(percent / (totalWeight * 100), 1).frenchify() + "g",
      );
      break;
    case 3:
      //percent
      tryToAddWrongProp(
        propositions,
        round(totalWeight / elWeight, 1).frenchify() + "\\%",
      );
      break;
  }
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      round(randfloat(1, 100), 1).frenchify() + (type === 3 ? "\\%" : "g"),
    );
  }
  return shuffleProps(propositions, n);
};

//m_A = P_A*m
const isAnswerValid: VEA<Identifiers> = (ans, { answer, type }) => {
  const texs = [answer];
  switch (type) {
    case 1:
      //total
      texs.push(answer.replace("g", ""));
      break;
    case 2:
      //el
      texs.push(answer.replace("g", ""));
      break;
    case 3:
      //percent
      texs.push(answer.replace("\\%", ""));
      break;
  }
  return texs.includes(ans);
};
export const weightPercent: Exercise<Identifiers> = {
  id: "weightPercent",
  connector: "=",
  label: "Utiliser ou calculer un pourcentage massique",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getWeightPercentQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
