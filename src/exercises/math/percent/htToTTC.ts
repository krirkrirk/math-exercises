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
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { numberParser } from "#root/tree/parsers/numberParser";
import { alignTex } from "#root/utils/latex/alignTex";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  TVA: number;
  ht: number;
};

const getHtToTtcQuestion: QuestionGenerator<Identifiers> = () => {
  const TVA = random([20, 5.5]);
  const ht = coinFlip() ? randint(50, 1000) : randfloat(20, 200, 2);
  const answer = round(ht * (1 + TVA / 100), 2).frenchify();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Un objet coûte $${ht.frenchify()}€$ en HT. Quel est son prix TTC, sachant que la TVA est de $${TVA.frenchify()}\\%$ ? (arrondir au centième)`,
    keys: [],
    answerFormat: "tex",
    identifiers: { TVA, ht },
    hint: `Pour augmenter un prix de $t\\%$, on le multiplie par $1 + \\frac{t}{100}$.`,
    correction: `Pour augmenter $${ht.frenchify()}$ de $${TVA.frenchify()}\\%$, on le multiplie par :
    
$$
1 + \\frac{${TVA.frenchify()}}{100} = ${round(1 + TVA / 100, 3).frenchify()}
$$ 

Le prix TTC est donc : 

$$
${ht.frenchify()} \\times ${round(1 + TVA / 100, 3).frenchify()} = ${answer}
$$
`,
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, TVA, ht }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, round((ht * TVA) / 100, 2).frenchify());
  tryToAddWrongProp(propositions, round(ht + TVA / 100, 2).frenchify());

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(50, 400, 2).frenchify());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return numberParser(ans) === answer;
};

export const htToTTC: Exercise<Identifiers> = {
  id: "htToTTC",
  connector: "=",
  label: "Passer d'un prix HT à un prix TTC",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getHtToTtcQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
