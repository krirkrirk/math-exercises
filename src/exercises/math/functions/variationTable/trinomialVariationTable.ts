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
import { TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  xValues: number[];
  fValues: number[];
  fValuess: number[];
};

const getTrinomialVariationTableQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const trinomial = TrinomConstructor.random();

  const valuesNumber = randint(2, 6);

  let xValues = [];
  let k = randint(-10, 10);
  for (let i = 0; i < valuesNumber; i++) {
    xValues.push(k);
    k = k + randint(1, 6);
  }

  let fValuess = [];
  for (let i = 0; i < valuesNumber; i++) {
    let image = trinomial.calculate(xValues[i]);
    fValuess.push(image);
  }

  const question: Question<Identifiers> = {
    answer: "",
    instruction: `Soit $f(x) = ${trinomial
      .toTree()
      .toTex()}$, complétez le tableau de variation suivant :`,
    keys: [],
    answerFormat: "tex",
    identifiers: { xValues, fValues: Array(valuesNumber).fill(NaN), fValuess },
    variationTableAlt: {
      xValues: xValues,
      fValues: Array(valuesNumber).fill(NaN),
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { fValues, fValuess }) => {
  return JSON.stringify(fValues) === JSON.stringify(fValuess);
};

export const trinomialVariationTable: Exercise<Identifiers> = {
  id: "trinomialVariationTable",
  label: "Tableau de variations pour un trinôme",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Fonctions"],
  generator: (nb: number) =>
    getDistinctQuestions(getTrinomialVariationTableQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
