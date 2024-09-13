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
import { DecimalConstructor } from "#root/math/numbers/decimals/decimal";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";

type Identifiers = {
  percent: number;
  nb: number;
};

const getValuePercentQuestion: QuestionGenerator<Identifiers> = () => {
  const percent = randint(1, 100);
  const nb = randint(1, 100);
  const ans = round((percent * nb) / 100, 2).frenchify();
  const question: Question<Identifiers> = {
    answer: ans + "",
    instruction: `Calculer $${percent}\\%$ de $${nb}$.`,
    keys: [],
    answerFormat: "tex",
    identifiers: { percent, nb },
    hint: `Pour calculer $x\\%$ d'un nombre, on le multiplie par $\\frac{x}{100}$.`,
    correction: `Pour calculer $${percent}\\%$ de $${nb}$, on multiplie $${nb}$ par $\\frac{${percent}}{100}$ : 
    
$
${nb}\\times \\frac{${percent}}{100} = ${ans}
$`,
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, percent, nb },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      DecimalConstructor.random(0, 100).toTree().toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, percent, nb }) => {
  return ans === answer;
};
export const valuePercent: Exercise<Identifiers> = {
  id: "valuePercent",
  connector: "=",
  label: "Calculer un pourcentage",
  levels: ["3ème", "2ndPro", "2nde", "1reESM", "1rePro"],
  isSingleStep: true,
  sections: ["Pourcentages"],
  generator: (nb: number) => getDistinctQuestions(getValuePercentQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
