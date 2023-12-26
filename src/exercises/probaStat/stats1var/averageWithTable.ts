import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { shuffle } from "#root/utils/shuffle";
import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

type QCMProps = {
  answer: string;
};
type VEAProps = {
  answer: string;
};

const getAverageWithTableQuestion: QuestionGenerator<
  QCMProps,
  VEAProps
> = () => {
  const getRandomUniqueValues = (
    count: number,
    min: number,
    max: number,
  ): number[] => {
    const uniqueValues: Set<number> = new Set();

    while (uniqueValues.size < count) {
      uniqueValues.add(randint(min, max));
    }

    return Array.from(uniqueValues).sort((a, b) => a - b);
  };

  const randomValeurs: number[] = getRandomUniqueValues(5, 1, 20);
  const randomEffectives = [1, 2, 3, 4, 5].map((el) => randint(1, 6));

  const sumEffectives = randomEffectives.reduce((sum, value) => sum + value, 0);
  let average = 0;

  for (let i = 0; i < randomValeurs.length; i++)
    average += randomValeurs[i] * randomEffectives[i];

  average /= sumEffectives;
  average = round(average, 2);

  const answer = (average + "").replace(".", ",");
  const question: Question<QCMProps, VEAProps> = {
    instruction: `On considère le tableau d'effectifs suivant : 

| | | | | | |
|-|-|-|-|-|-|
|Valeur|${randomValeurs[0]}|${randomValeurs[1]}|${randomValeurs[2]}|${randomValeurs[3]}|${randomValeurs[4]}|
|Effectif|${randomEffectives[0]}|${randomEffectives[1]}|${randomEffectives[2]}|${randomEffectives[3]}|${randomEffectives[4]}|

Calculer la moyenne de cette série de valeurs (arrondir au centième).`,

    answer,
    keys: [],
    answerFormat: "tex",
    qcmGeneratorProps: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const average = Number(answer.replace(",", "."));
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      round(
        average + randint(-average, 20 - average, [0]) + randint(1, 100) / 100,
        2,
      )
        .toString()
        .replace(".", ","),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<VEAProps> = (ans, { answer }) => {
  return ans === answer;
};

export const averageWithTable: MathExercise<QCMProps, VEAProps> = {
  id: "averageWithTable",
  connector: "=",
  label: "Calcul de la moyenne d'un tableau d'effectifs",
  levels: ["3ème", "2nde", "CAP", "2ndPro", "1rePro", "1reTech"],
  isSingleStep: false,
  sections: ["Statistiques"],
  generator: (nb: number) =>
    getDistinctQuestions(getAverageWithTableQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
