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
import { round } from "#root/math/utils/round";
import { shuffle } from "#root/utils/shuffle";
type Identifiers = {
  flip: number;
  pA: number;
  pB: number;
  pAB: number;
};

const getConditionalProbability: QuestionGenerator<Identifiers> = () => {
  const pA = randint(2, 100);
  const pB = randint(2, 100);
  const pAB = randint(1, Math.min(pA, pB));
  const pA_B = round(pAB / pB, 2);
  const pB_A = round(pAB / pA, 2);

  const flip = randint(1, 7);

  let instruction = `On considère deux événements $A$ et $B$ tels que `;
  let startStatement = "";
  let answer = "";

  switch (flip) {
    case 1: {
      instruction += `$P(A) = ${(pA / 100 + "").replace(
        ".",
        ",",
      )}\\ $ et $\\ P(A \\cap B) = ${(pAB / 100 + "").replace(
        ".",
        ",",
      )}$.$\\\\$Déterminer $P_A(B)$.`;
      startStatement = `P_A(B)`;
      answer = `${pB_A}`;
      break;
    }
    case 2: {
      instruction += `$P(B) = ${(pB / 100 + "").replace(
        ".",
        ",",
      )}\\ $ et $\\ P(B \\cap A) = ${(pAB / 100 + "").replace(
        ".",
        ",",
      )}$.$\\\\$Déterminer $P_B(A)$.`;
      startStatement = `P_B(A)`;
      answer = `${pA_B}`;
      break;
    }
    case 3: {
      instruction += `$P(A) = ${(pA / 100 + "").replace(
        ".",
        ",",
      )}\\ $ et $\\ P_A(B) = ${(pB_A + "").replace(
        ".",
        ",",
      )}$.$\\\\$Déterminer $P(A \\cap B)$.`;
      startStatement = `P(A \\cap B)`;
      answer = `${pAB / 100}`;
      break;
    }
    case 4: {
      instruction += `$P(B) = ${(pB / 100 + "").replace(
        ".",
        ",",
      )}\\ $ et $\\ P_B(A) = ${(pA_B + "").replace(
        ".",
        ",",
      )}$.$\\\\$Déterminer $P(A \\cap B)$.`;
      startStatement = `P(A \\cap B)`;
      answer = `${pAB / 100}`;
      break;
    }
    case 5: {
      instruction += `$P(A \\cap B) = ${(pAB / 100 + "").replace(
        ".",
        ",",
      )}\\ $ et $\\ P_B(A) = ${(pA_B + "").replace(
        ".",
        ",",
      )}$.$\\\\$Déterminer $P(B)$.`;
      startStatement = `P(B)`;
      answer = `${pB / 100}`;
      break;
    }
    case 6: {
      instruction += `$P(A \\cap B) = ${(pAB / 100 + "").replace(
        ".",
        ",",
      )}\\ $ et $\\ P_A(B) = ${(pB_A + "").replace(
        ".",
        ",",
      )}$.$\\\\$Déterminer $P(A)$.`;
      startStatement = `P(A)`;
      answer = `${pA / 100}`;
      break;
    }
  }
  answer = answer.replace(".", ",");
  const question: Question<Identifiers> = {
    instruction,
    startStatement,
    answer,
    keys: ["p", "cap", "underscore"],
    answerFormat: "tex",
    identifiers: { flip, pA, pAB, pB },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      (Math.floor(Math.random() * 100) / 100 + "").replace(".", ","),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const conditionalProbability: Exercise<Identifiers> = {
  id: "conditionalProbability",
  connector: "=",
  label: "Calcul de probabilité conditionnelle avec la formule de Bayes",
  levels: ["1reESM", "1reSpé", "1reTech", "TermTech", "1rePro", "TermPro"],
  isSingleStep: false,
  sections: ["Probabilités"],
  generator: (nb: number) =>
    getDistinctQuestions(getConditionalProbability, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
