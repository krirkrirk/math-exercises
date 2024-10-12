import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { numberParser } from "#root/tree/parsers/numberParser";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  TTC: number;
  TVA: number;
};

const getTtcToHtQuestion: QuestionGenerator<Identifiers> = () => {
  const TVA = random([20, 5.5]);
  const TTC = coinFlip() ? randint(50, 1000) : randfloat(20, 200, 2);
  const answer = round(TTC / (1 + TVA / 100), 2).frenchify();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Un objet coûte $${TTC.frenchify()}€$ en TTC. Quel est son prix HT, sachant que la TVA est de $${TVA.frenchify()}\\%$ ? (arrondir au centième)`,
    keys: [],
    answerFormat: "tex",
    identifiers: { TTC, TVA },
    hint: `Pour retrouver le prix HT d'un objet après une hausse de $t\\%$, on divise le prix TTC par $1 + \\frac{t}{100}$.`,
    correction: `Pour retrouver le prix HT après une hausse de  $${TVA.frenchify()}\\%$, on divise le prix TTC par :
    
$$
1 + \\frac{${TVA.frenchify()}}{100} = ${round(1 + TVA / 100, 3).frenchify()}
$$ 

Le prix HT est donc : 

$$
${TTC.frenchify()} \\div ${round(
      1 + TVA / 100,
      3,
    ).frenchify()} \\approx ${answer}
$$
`,
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, TTC, TVA },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, round(TTC * (1 + TVA / 100), 2).frenchify());
  tryToAddWrongProp(
    propositions,
    round(TTC - (1 + TVA / 100) * TTC, 2).frenchify(),
  );

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(50, 400, 2).frenchify());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return numberParser(ans) === answer;
};

export const ttcToHT: Exercise<Identifiers> = {
  id: "ttcToHT",
  connector: "=",
  label: "Passer d'un prix TTC à un prix HT",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getTtcToHtQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
