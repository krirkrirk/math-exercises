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
import { randomColor } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  a: number;
  b: number;
  c: number;
};

const getRootsReadingQuestion: QuestionGenerator<Identifiers> = () => {
  const trinom = TrinomConstructor.randomNiceRoots(randint(1, 3));
  const roots = trinom.getRoots();
  const commands = [
    `f(x) = ${trinom.toString()}`,
    `SetColor(f, "${randomColor()}")`,
  ];
  const ggb = new GeogebraConstructor(commands, {
    isGridSimple: true,
    isAxesRatioFixed: false,
    gridDistance: false,
  });
  const answer =
    roots.length === 1 ? roots[0].toString() : roots.join("\\text{ et }");

  const question: Question<Identifiers> = {
    answer,
    instruction: `Déterminer graphiquement le ou les racine(s) du polynôme du second degré représenté ci-dessous : `,
    keys: ["et", "aucun"],
    answerFormat: "tex",
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: trinom.getCoords(),
    identifiers: { a: trinom.a, b: trinom.b, c: trinom.c },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const x1 = randint(-10, 10);
    const x2 = randint(-10, 10, [x1]);
    const fakeRoots = x1 > x2 ? [x2, x1] : [x1, x2];
    tryToAddWrongProp(propositions, fakeRoots.join("\\text{ et }"));
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, a, b, c }) => {
  const roots = new Trinom(a, b, c).getRoots();
  const studentNumbers = ans
    .split("\\text{ et }")
    .map((n) => Number(n.replace(",", ".")))
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b);
  return (
    !!studentNumbers.length &&
    studentNumbers.every((nb, index) => Math.abs(nb - roots[index]) < 0.2)
  );
};
export const rootsReading: Exercise<Identifiers> = {
  id: "rootsReading",
  label: "Lire graphiquement les racines d'un trinôme",
  levels: ["1reSpé", "1rePro"],
  isSingleStep: true,
  sections: ["Second degré"],
  generator: (nb: number) => getDistinctQuestions(getRootsReadingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
