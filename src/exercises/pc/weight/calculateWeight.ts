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
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { earthGravity } from "#root/pc/constants/gravity";

const g = +earthGravity.measure.significantPart.toFixed(2);

type Identifiers = {
  mass: number;
};

const getCalculateWeightQuestion: QuestionGenerator<Identifiers> = () => {
  const exo = generateExercise();

  const question: Question<Identifiers> = {
    answer: exo.answer.toTex(),
    instruction: exo.instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { mass: exo.mass },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, mass }) => {
  const propositions: Proposition[] = [];
  const weight = mass * g;
  addValidProp(propositions, answer);
  generatePropositions(mass).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  while (propositions.length < n) {
    let random = randfloat(weight - 50, weight + 50, 2, [weight]);
    tryToAddWrongProp(propositions, random.toScientific(2).toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generatePropositions = (mass: number): string[] => {
  const weight = mass * g;
  const first = (weight * 10).toScientific(2);
  const second = (
    randfloat(weight - 100, weight + 100, 2, [weight]) / 10
  ).toScientific(2);
  return [first.toTex(), second.toTex()];
};

const generateExercise = () => {
  const mass = randint(30, 151);
  const instruction = `Soit un objet avec une masse de $${mass}$ $kg$. Calculer le poids de cet objet.`;
  const answer = (mass * g).toScientific(2);

  return {
    instruction,
    answer,
    mass,
  };
};
export const calculateWeight: Exercise<Identifiers> = {
  id: "calculateWeight",
  label: "Calculer le poids d'un objet",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Forces"],
  generator: (nb: number) =>
    getDistinctQuestions(getCalculateWeightQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
