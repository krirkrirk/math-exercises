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
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { coinFlip } from "#root/utils/alea/coinFlip";

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
    hint: `Le coefficient multiplicateur associé à une ${
      isHausse ? "hausse" : "baisse"
    }  de $t\\%$ est donné par $${
      isHausse ? "1+\\frac{t}{100}" : "1-\\frac{t}{100}"
    }$.
    `,
    correction: `Le coefficient multiplicateur associé à une ${
      isHausse ? "hausse" : "baisse"
    }  de $t\\%$ est donné par $${
      isHausse ? "1+\\frac{t}{100}" : "1-\\frac{t}{100}"
    }$.

Ici, on a $t = ${Math.abs(
      evolution,
    )}$\\%, donc le coefficient multiplicateur vaut : 

$$
1${isHausse ? "+" : "-"}\\frac{${Math.abs(evolution)}}{100} = ${CM}
$$

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
  hasHintAndCorrection: true,
};
