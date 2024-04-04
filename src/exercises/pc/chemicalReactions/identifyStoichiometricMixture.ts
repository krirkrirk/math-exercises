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
import { roundSignificant } from "#root/math/utils/round";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  firstReagentVariables: number[];
  secondReagentVariables: number[];
};

const getIdentifyStoichiometricMixtureQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const isForcedStoichiometric = coinFlip();
  let firstReagentVariables = [];
  let secondReagentVariables = [];
  let firstXMax;
  let secondXMax;

  if (isForcedStoichiometric) {
    const factor = randint(1, 7);
    const firstMultiplicator = randint(1, 5);
    const secondMultiplicator = randint(1, 5, [firstMultiplicator]);
    firstReagentVariables.push(factor * firstMultiplicator, firstMultiplicator);
    secondReagentVariables.push(
      factor * secondMultiplicator,
      secondMultiplicator,
    );
  }

  if (!isForcedStoichiometric) {
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
  }

  const isStoichiometric = isForcedStoichiometric
    ? true
    : firstXMax === secondXMax;

  const instruction = `On considère l'état final d'un système chimique,
  pour lequel il y a eu transformation totale. Les quantités finales des
  deux réactifs $\\text{A}$ et $\\text{B (en mmol)}$, sont $\\text{n}_{\\text{A}} = ${roundSignificant(
    firstReagentVariables[0],
    1,
  )} - ${
    firstReagentVariables[1] === 1 ? "" : firstReagentVariables[1]
  } x_{\\text{max}}$ et $\\text{n}_{\\text{B}} = ${roundSignificant(
    secondReagentVariables[0],
    1,
  )} - ${
    secondReagentVariables[1] === 1 ? "" : secondReagentVariables[1]
  } x_{\\text{max}}$. Le mélange initial est-il stoechiométrique ?`;

  const question: Question<Identifiers> = {
    answer: isStoichiometric ? "Oui" : "Non",
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
  tryToAddWrongProp(propositions, "Oui", "raw");
  tryToAddWrongProp(propositions, "Non", "raw");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const identifyStoichiometricMixture: Exercise<Identifiers> = {
  id: "identifyStoichiometricMixture",
  label: "Identifier un mélange stoechiométrique",
  levels: ["1reESM"],
  isSingleStep: true,
  sections: ["Chimie des solutions"],
  generator: (nb: number) =>
    getDistinctQuestions(getIdentifyStoichiometricMixtureQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
  answerType: "QCM",
};
