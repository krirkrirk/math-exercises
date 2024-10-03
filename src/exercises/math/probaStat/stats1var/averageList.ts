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
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { operatorComposition } from "#root/tree/utilities/operatorComposition";
import { average } from "#root/utils/average";

type Identifiers = {
  sortedValues: number[];
};

const getAverageListQuestion: QuestionGenerator<Identifiers> = () => {
  let randomValues: number[] = [];
  const length = randint(6, 10);

  for (let i = 0; i < length; i++) randomValues.push(randint(1, 20));

  const sortedValues = randomValues.sort((a, b) => a - b);
  const avg = average(sortedValues);
  const answer = round(average(sortedValues), 2).frenchify();
  const hasRounded = avg.frenchify() !== answer;
  const question: Question<Identifiers> = {
    answer,
    instruction: `On considère la liste suivante : $${randomValues.join(
      ";\\ ",
    )}.$
    $\\\\$Calculer la moyenne de cette liste de valeurs (arrondir au centième).`,
    keys: [],
    answerFormat: "tex",
    identifiers: { sortedValues },
    hint: "La moyenne d'une liste de valeurs est la somme de ses valeurs divisé par le nombre de valeurs.",
    correction: `
On additionne toutes les valeurs :

$$
${operatorComposition(
  AddNode,
  sortedValues.map((e) => e.toTree()),
).toTex()} = ${sortedValues.reduce((acc, curr) => acc + curr)}
$$

puis on divise par le nombre de valeurs : 

$$
${sortedValues.reduce((acc, curr) => acc + curr)}\\div ${sortedValues.length} ${
      hasRounded ? "\\approx" : "="
    } ${answer}
$$

La moyenne ${hasRounded ? "arrondie au centième" : ""} est donc $${answer}$.
    `,
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, sortedValues },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    sortedValues.reduce((acc, curr) => acc + curr) + "",
  );
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(3, 20, 2).frenchify());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const averageList: Exercise<Identifiers> = {
  id: "averageList",
  connector: "=",
  label: "Calcul de la moyenne d'une liste de valeurs",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getAverageListQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
