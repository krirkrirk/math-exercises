import {
  Proposition,
  Question,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  tryToAddWrongProp,
  VEA,
  Exercise,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  concentrationMere: number;
  volumeFille: number;
  concentrationFille: number;
};

const getDelution: QuestionGenerator<Identifiers> = () => {
  const concentrationMere = round(Math.random() * 0.4 + 0.1, 2); // entre 0.1 et 0.5 mol/L pour C1
  const volumeFille = round(Math.random() * 200 + 50, 0); // entre 50 et 250 mL pour V2
  const concentrationFille = round(Math.random() * 0.05 + 0.01, 2); // entre 0.01 et 0.06 mol/L pour C2
  const volumeMere = round(
    (volumeFille * concentrationFille) / concentrationMere,
    2,
  );

  const instruction = `Soit une solution mère de concentration $C_1$ = $${concentrationMere}$ mol/L. On souhaite préparer
  une solution ﬁlle de volume $V_2$ = $${volumeFille}$ mL de concentration $C_2$ = $${concentrationFille}$ mol/L.
  $\\\\$ Calculer le volume $V_1$ à prélever.`;
  const answer = volumeMere + " \\ mL";
  const question: Question<Identifiers> = {
    instruction,
    startStatement: `V_1`,
    answer,
    keys: ["mL"],
    answerFormat: "tex",
    identifiers: { concentrationFille, concentrationMere, volumeFille },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, concentrationFille, concentrationMere, volumeFille },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const volumeMere = round(
    (volumeFille * concentrationFille) / concentrationMere,
    2,
  );
  tryToAddWrongProp(
    propositions,
    round((volumeFille * concentrationMere) / concentrationFille, 2) + " \\ mL",
  );
  tryToAddWrongProp(
    propositions,
    round(concentrationMere / (volumeFille * concentrationFille), 2) + " \\ mL",
  );

  while (propositions.length < n) {
    const wrongAnswer = volumeMere + randint(-volumeMere, 11, [0]);
    tryToAddWrongProp(propositions, wrongAnswer.toFixed(2) + " \\ mL");
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const delution: Exercise<Identifiers> = {
  id: "delution",
  connector: "=",
  label: "Déterminer le volume d'une solution après dilution.",
  levels: ["4ème", "3ème", "2nde"],
  sections: ["Chimie des solutions"],
  subject: "Chimie",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getDelution, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
