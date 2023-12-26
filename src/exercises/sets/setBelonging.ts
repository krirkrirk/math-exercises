import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { DecimalConstructor } from "#root/math/numbers/decimals/decimal";
import { RationalConstructor } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { random } from "#root/utils/random";
import { shuffle } from "#root/utils/shuffle";

type QCMProps = {
  answer: string;
};
type VEAProps = {
  answer: string;
};

const getSetBelongingQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  //N Z D Q R (racine2, pi)
  //fraction simplifiable en décimal/entier
  //racine carrée simplifiable en entier / Fraction
  //
  const type = randint(0, 5);
  let answer = "";
  let nb = "";
  switch (type) {
    case 0:
      nb = randint(0, 1000) + "";
      answer = "\\mathbb{N}";
      break;
    case 1:
      nb = -randint(0, 1000) + "";
      answer = "\\mathbb{Z}";
      break;
    case 2:
      nb = DecimalConstructor.random(-50, 50, randint(1, 4)).toTree().toTex();
      answer = "\\mathrm{D}";
      break;
    case 3:
      nb = RationalConstructor.randomIrreductible().toTree().toTex();
      answer = "\\mathbb{Q}";
      break;
    case 4:
      nb = random(["\\sqrt 2", "\\pi"]);
      answer = "\\mathbb{R}";
      break;
  }

  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction: `Donner le plus petit ensemble auquel le nombre $${nb}$ appartient.`,
    keys: [
      "emptyset",
      "naturals",
      "integers",
      "decimals",
      "rationals",
      "reals",
    ],
    answerFormat: "tex",
    qcmGeneratorProps: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  const availableSets = ["N", "Z", "D", "Q", "R"]
    .map((el) => `\\mathbb{${el}}`)
    .filter((el) => el !== answer);
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const wrongAnswer = random(availableSets);

    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<VEAProps> = (ans, { answer }) => {
  return [answer, answer.replace("mathbb", "mathrm")].includes(ans);
};

export const setBelonging: MathExercise<QCMProps, VEAProps> = {
  id: "setBelonging",
  connector: "\\iff",
  label: "Déterminer le plus petit ensemble auquel un nombre appartient",
  levels: ["2nde", "1reESM"],
  isSingleStep: true,
  sections: ["Ensembles et intervalles"],
  generator: (nb: number) => getDistinctQuestions(getSetBelongingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
