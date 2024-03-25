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
import { Decimal } from "#root/math/numbers/decimals/decimal";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";

type Identifiers = {
  frequency: number;
};

const getFindSoundPeriodFromFrequencyQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const frequency = randint(20, 20000);
  const period = 1 / frequency;
  const periodDecimal = new Decimal(period);
  const answer = periodDecimal
    .toScientificNotation(1)
    .toTex({ allowOneInProducts: true });

  const question: Question<Identifiers> = {
    answer,
    instruction: `Un signal sonore a une fréquence de $${frequency}\\ \\text{Hz}$. Calculer la période de ce signal en secondes (en écriture scientifique avec 2 chiffres significatifs).`,
    keys: ["timesTenPower"],
    answerFormat: "tex",
    identifiers: { frequency },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, frequency },
) => {
  const propositions: Proposition[] = [];
  const period = 1 / frequency;
  const dec = new Decimal(period);
  const wrongPeriod = dec
    .multiplyByPowerOfTen(randint(-2, 2, [0]))
    .toScientificNotation(1)
    .toTex({ allowOneInProducts: true });
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, wrongPeriod);

  while (propositions.length < n) {
    const period = 1 / randint(20, 20000);
    const periodDecimal = new Decimal(period);
    tryToAddWrongProp(
      propositions,
      periodDecimal.toScientificNotation(1).toTex({ allowOneInProducts: true }),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { frequency }) => {
  const period = 1 / frequency;
  const periodDecimal = new Decimal(period);
  const periodNotation = periodDecimal.toScientificNotation(1);
  const texs = periodNotation.toAllValidTexs({ forbidPowerToProduct: true });
  return texs.includes(ans);
};

export const findSoundPeriodFromFrequency: Exercise<Identifiers> = {
  id: "findSoundPeriodFromFrequency",
  label: "Calculer la période d'un signal sonore en fonction de la fréquence",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Son"],
  generator: (nb: number) =>
    getDistinctQuestions(getFindSoundPeriodFromFrequencyQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
