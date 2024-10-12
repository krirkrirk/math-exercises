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
import { randTupleInt } from "#root/math/utils/random/randTupleInt";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {};

const getIsTableProportionalQuestion: QuestionGenerator<Identifiers> = () => {
  const xValues: number[] = randTupleInt(3, {
    from: 1,
    to: 15,
    allDifferent: true,
  }).sort((a, b) => a - b);

  const isProportionnal = coinFlip();
  const coeff = randint(2, 6);
  const yValues = isProportionnal
    ? xValues.map((value) => value * coeff)
    : xValues.map((value) => value * randint(2, 5));

  const question: Question<Identifiers> = {
    answer: isProportionnal ? "Oui" : "Non",
    instruction: `On considère le tableau ci-dessous. Est-ce un tableau de proportionnalité
 |${xValues.map((value) => `$${value}$`).join("|")}|
  |-|-|-|
  |${yValues.map((value) => `$${value}$`).join("|")}|
  `,
    keys: [],
    answerFormat: "raw",
    style: { tableHasNoHeader: true },
    identifiers: {
      xValues,
      yValues,
    },
    hint: "Pour passer de la ligne du haut à la ligne du bas, multiplie-t-on toujours par le même nombre ? Si oui, alors c'est un tableau de proportionnalité.",
    correction: `On divise les nombres de la deuxième ligne par les nombres de la première ligne. Si on obtient toujours le même résultat, alors c'est un tableau de proportionnalité. 

- $${yValues[0]}\\div ${xValues[0]} = ${yValues[0] / xValues[0]}$

- $${yValues[1]}\\div ${xValues[1]} = ${yValues[1] / xValues[1]}$

- $${yValues[2]}\\div ${xValues[2]} = ${yValues[2] / xValues[2]}$

${
  isProportionnal
    ? "Puisque tous les résultats sont égaux, c'est bien un tableau de proportionnalité."
    : "Puisque les résultats ne sont pas tous égaux, ce n'est pas un tableau de proportionnalité."
}
    `,
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Oui", "raw");
  tryToAddWrongProp(propositions, "Non", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const isTableProportional: Exercise<Identifiers> = {
  id: "isVTableProportional",
  label: "Reconnaître un tableau de proportionnalité",
  levels: ["5ème"],
  isSingleStep: true,
  sections: ["Proportionnalité"],
  generator: (nb: number) =>
    getDistinctQuestions(getIsTableProportionalQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  answerType: "QCU",
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
