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
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Point } from "#root/math/geometry/point";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";
import { random } from "#root/utils/random";

type Identifiers = {
  isAri: boolean;
  sequence: number[];
};

const getRandomFirstNonAriTerms = () => {
  const type = randint(0, 3);
  switch (type) {
    case 0:
      const firstGeoTerm = randint(1, 4);
      const geoReason = random([2, 3]);
      return new Array(10)
        .fill(0)
        .map((el, index) => firstGeoTerm * geoReason ** index);
    case 1:
      const firstBernoulliTerm = randint(1, 10);
      const secondBernoulliTerm = randint(1, 10, [firstBernoulliTerm]);
      return new Array(10)
        .fill(0)
        .map((el, index) =>
          index % 2 ? firstBernoulliTerm : secondBernoulliTerm,
        );
    case 2:
    default:
      const firstFakeAriTerm = randint(1, 20);
      const res = new Array(10)
        .fill(0)
        .map((el, index) => firstFakeAriTerm + randint(1, 4));
      const disruptionIndex = randint(0, 5);
      res[disruptionIndex] = res[disruptionIndex] + random([-1, 1]);
      return res;
  }
};
const getRecognizeArithmeticFromGraphQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const isAri = coinFlip();
  const firstAriTerm = randint(-5, 10);
  const reason = randint(-4, 6, [0]);
  const sequence = isAri
    ? new Array(10).fill(0).map((el, index) => firstAriTerm + reason * index)
    : getRandomFirstNonAriTerms();
  const answer = isAri ? "Oui" : "Non";
  const commands = sequence.flatMap((nb, index) => [
    new Point(`A_${index}`, index.toTree(), nb.toTree()).toGGBCommand(),
    `SetFixed(A_${index}, true)`,
  ]);
  const ggb = new GeogebraConstructor({
    commands,
    lockedAxesRatio: false,
    xAxis: { natural: true },
  });
  const yMin = Math.min(...sequence.slice(0, 5));
  const yMax = Math.max(...sequence.slice(0, 5));
  const question: Question<Identifiers> = {
    answer,
    instruction: `La suite $u$ représentée ci-dessous semble-t-elle arithmétique ?`,
    keys: [],
    ggbOptions: ggb.getOptions({
      coords: [-1, 7, Math.min(-1, yMin - 2), Math.max(1, yMax + 2)],
    }),
    answerFormat: "tex",
    identifiers: { sequence, isAri },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Oui", "raw");
  tryToAddWrongProp(propositions, "Non", "raw");

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const recognizeArithmeticFromGraph: Exercise<Identifiers> = {
  id: "recognizeArithmeticFromGraph",
  label: "Reconnaître graphiquement si une suite est arithmétique",
  levels: ["1reESM", "1rePro", "1reSpé", "1reTech"],
  isSingleStep: true,
  sections: ["Suites"],
  generator: (nb: number) =>
    getDistinctQuestions(getRecognizeArithmeticFromGraphQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  answerType: "QCU",
  hasGeogebra: true,
  subject: "Mathématiques",
};
