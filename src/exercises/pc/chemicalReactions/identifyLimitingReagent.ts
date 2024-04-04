import { roundSignificant } from "#root/math/utils/round";
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
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  firstReagentVariables: number[];
  secondReagentVariables: number[];
};

const getIdentifyLimitingReagentQuestion: QuestionGenerator<
  Identifiers
> = () => {
  let firstReagentVariables = [];
  let secondReagentVariables = [];
  let firstXMax;
  let secondXMax;

  do {
    firstReagentVariables = [];
    secondReagentVariables = [];
    firstReagentVariables.push(randint(1, 11));
    firstReagentVariables.push(randint(1, 5, [firstReagentVariables[0]]));

    secondReagentVariables.push(
      randint(1, 11, [firstReagentVariables[0], firstReagentVariables[1]]),
    );
    secondReagentVariables.push(
      randint(1, 5, [firstReagentVariables[0], firstReagentVariables[1]]),
    );

    firstXMax = roundSignificant(
      firstReagentVariables[0] / firstReagentVariables[1],
      1,
    );
    secondXMax = roundSignificant(
      secondReagentVariables[0] / secondReagentVariables[1],
      1,
    );
  } while (firstXMax === secondXMax);

  const limitingReagent =
    firstXMax < secondXMax ? "Le réactif A" : "Le réactif B";

  const instruction = `On considère l'état final d'un système chimique,
  pour lequel il y a eu transformation totale. Les quantités finales des
  deux réactifs $\\text{A}$ et $\\text{B (en mol)}$, sont $\\text{n}_{\\text{A}} = ${roundSignificant(
    firstReagentVariables[0],
    1,
  )} - ${
    firstReagentVariables[1] === 1 ? "" : firstReagentVariables[1]
  } x_{\\text{max}}$ et $\\text{n}_{\\text{
    B
  }} = ${roundSignificant(secondReagentVariables[0], 1)} - ${
    secondReagentVariables[1] === 1 ? "" : secondReagentVariables[1]
  } x_{\\text{max}}$. Quel est le réactif limitant ?`;

  const question: Question<Identifiers> = {
    answer: limitingReagent,
    instruction,
    keys: [],
    answerFormat: "raw",
    identifiers: { firstReagentVariables, secondReagentVariables },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Le réactif A", "raw");
  tryToAddWrongProp(propositions, "Le réactif B", "raw");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const identifyLimitingReagent: Exercise<Identifiers> = {
  id: "identifyLimitingReagent",
  label: "Identifier un réactif limitant",
  levels: ["1reESM"],
  isSingleStep: true,
  sections: ["Chimie des solutions"],
  generator: (nb: number) =>
    getDistinctQuestions(getIdentifyLimitingReagentQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
  answerType: "QCM",
};
