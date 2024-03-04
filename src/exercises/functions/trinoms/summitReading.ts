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
import { randomColor } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Point } from "#root/math/geometry/point";
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  a: number;
  b: number;
  c: number;
};

const getSummitReadingQuestion: QuestionGenerator<Identifiers> = () => {
  const trinom = TrinomConstructor.randomCanonical();
  const commands = [
    `f(x) = ${trinom.toString()}`,
    `SetColor(f, "${randomColor()}")`,
  ];
  const ggb = new GeogebraConstructor(commands, {
    isGridSimple: true,
  });

  const answer = trinom.getSommet().toCoords();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Déterminer les coordonnées du sommet de la parabole représentée ci-dessous :`,
    keys: ["leftParenthesis", "semicolon", "rightParenthesis"],
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: trinom.getCoords(),
    answerFormat: "tex",
    identifiers: { a: trinom.a, b: trinom.b, c: trinom.c },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b, c }) => {
  const propositions: Proposition[] = [];
  const trinom = new Trinom(a, b, c);
  const alpha = trinom.getAlpha();
  const beta = trinom.getBeta();

  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new Point("S", beta.toTree(), alpha.toTree()).toCoords(),
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new Point(
        "S",
        randint(-10, 10).toTree(),
        randint(-10, 10).toTree(),
      ).toCoords(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const summitReading: MathExercise<Identifiers> = {
  id: "summitReading",
  label: "Déterminer graphiquement les coordonnées du sommet d'une parabole",
  levels: ["1rePro", "1reSpé"],
  isSingleStep: true,
  sections: ["Second degré"],
  generator: (nb: number) => getDistinctQuestions(getSummitReadingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
