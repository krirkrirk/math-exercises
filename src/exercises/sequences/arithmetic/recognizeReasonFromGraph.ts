import {
  MathExercise,
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
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Point } from "#root/math/geometry/point";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  reason: number;
  sequence: number[];
};

const getRecognizeReasonFromGraphQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const firstTerm = randint(1, 20);
  const reason = randint(-5, 6, [0]);
  const sequence = new Array(5)
    .fill(0)
    .map((el, index) => firstTerm + index * reason);

  const yMin = Math.min(...sequence);
  const yMax = Math.max(...sequence);
  const commands = sequence.map((nb, index) =>
    new Point(`A_${index}`, index.toTree(), nb.toTree()).toGGBCommand(),
  );
  const ggb = new GeogebraConstructor(commands, {
    isGridSimple: true,
    isXAxesNatural: true,
    isAxesRatioFixed: false,
  });
  const answer = reason + "";
  const question: Question<Identifiers> = {
    answer,
    instruction: `Déterminer la raison de la suite arithmétique $u$ représentée ci-dessous :`,
    keys: [],
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: [-1, 7, Math.min(-1, yMin - 2), Math.max(1, yMax + 2)],
    answerFormat: "tex",
    identifiers: { reason, sequence },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-5, 6) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const recognizeReasonFromGraph: MathExercise<Identifiers> = {
  id: "recognizeReasonFromGraph",
  label: "Reconnaître graphiquement la raison d'une suite arithmétique",

  levels: ["1reESM", "1reSpé", "1rePro", "1reTech"],
  isSingleStep: true,
  sections: ["Suites"],
  generator: (nb: number) =>
    getDistinctQuestions(getRecognizeReasonFromGraphQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
