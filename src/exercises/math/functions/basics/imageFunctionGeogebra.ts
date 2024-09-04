import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randomColor } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  rand: boolean;
  poly1: number[];
  poly2: number[];
  xValue: number;
};
const getImageFunctionGeogebra: QuestionGenerator<Identifiers> = () => {
  const rand = coinFlip();
  const xValue = randint(-5, 6);

  let polynome1;
  do {
    polynome1 = new Polynomial([randint(-9, 10), randint(-5, 6, [0])]);
  } while (
    polynome1.calculate(xValue) > 10 ||
    polynome1.calculate(xValue) < -10
  );

  let polynome2;
  do {
    polynome2 = new Polynomial([
      randint(-9, 10),
      randint(-9, 10),
      randint(-4, 5, [0]),
    ]);
  } while (
    polynome2.calculate(xValue) > 10 ||
    polynome2.calculate(xValue) < -10
  );

  const statement = `Quelle est l'image de $${xValue}$ par la fonction $f$ représentée ci dessous ?`;

  const answer = rand
    ? polynome1.calculate(xValue)
    : polynome2.calculate(xValue);

  const xMin = xValue;
  const xMax = xValue;
  const yMin = answer;
  const yMax = answer;

  const commands = [
    `f(x) = ${rand ? polynome1.toString() : polynome2.toString()}`,
    `SetColor(f, "${randomColor()}")`,
  ];
  const ggb = new GeogebraConstructor({ commands });
  const answerTex = answer + "";
  const question: Question<Identifiers> = {
    instruction: statement,
    startStatement: `f(${xValue})`,
    answer: answerTex,
    keys: [],
    ggbOptions: ggb.getOptions({ coords: [-10, 10, -10, 10] }),
    answerFormat: "tex",
    identifiers: {
      poly1: polynome1.coefficients,
      poly2: polynome2.coefficients,
      rand,
      xValue,
    },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const wrongAnswer = Number(answer) + randint(-10, 11, [0]);

    tryToAddWrongProp(propositions, wrongAnswer + "");
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const imageFunctionGeogebra: Exercise<Identifiers> = {
  id: "imageFunctionGeogebra",
  connector: "=",
  label: "Lecture d'une image",
  levels: ["3ème", "2nde", "CAP", "2ndPro", "1rePro", "1reTech"],
  sections: ["Fonctions"],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getImageFunctionGeogebra, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
