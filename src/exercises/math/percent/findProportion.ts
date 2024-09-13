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
import { frenchify } from "#root/math/utils/latex/frenchify";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { alignTex } from "#root/utils/alignTex";

type Identifiers = {
  total: number;
  lefties: number;
};

const getFindProportionQuestion: QuestionGenerator<Identifiers> = () => {
  const total = randint(100, 200);
  const lefties = randint(30, 120);
  const answer = round((lefties / total) * 100, 2).frenchify() + "\\%";
  const question: Question<Identifiers> = {
    answer,
    instruction: `Dans un lycée de $${total}$ élèves, $${lefties}$ sont gauchers. Quel est le pourcentage de gauchers dans ce lycée ? (arrondir au centième de pourcentage)`,
    keys: ["percent"],
    answerFormat: "tex",
    identifiers: { total, lefties },
    hint: `La proportion de gauchers s'obtient par la formule  :
    
$$
\\frac{\\text{nombre de gauchers}}{\\text{nombre d'élèves}}\\times 100
$$

  `,
    correction: `Le pourcentage de gauchers dans ce lycée est de : 

$$
\\frac{${lefties}}{${total}}\\times 100 = ${answer}
$$

    `,
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, total, lefties },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    round((100 * total) / lefties, 2).frenchify() + "\\%",
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      round(randfloat(1, 100), 2).frenchify() + "\\%",
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const texs = [answer, answer.replace("\\%", "")];
  return texs.includes(ans);
};
export const findProportion: Exercise<Identifiers> = {
  id: "findProportion",
  connector: "=",
  label: "Calculer une proportion",
  levels: ["4ème", "3ème", "2nde"],
  isSingleStep: true,
  sections: ["Pourcentages"],
  generator: (nb: number) =>
    getDistinctQuestions(getFindProportionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
