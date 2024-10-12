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
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/alea/shuffle";
type Identifiers = {
  poly1: number[];
  xValue: number;
};
const getInverseImageFunction: QuestionGenerator<Identifiers> = () => {
  const polynome1 = new Polynomial([randint(-9, 10), randint(-5, 6, [0])]);
  const xValue = randint(-9, 10);

  let image = polynome1.calculate(xValue) + "";
  const statement = `Soit $f(x) = ${polynome1
    .toTree()
    .toTex()}$. Déterminer le ou les antécédents de $${image}$ par $f$.`;
  const answer = "x=" + xValue;
  const question: Question<Identifiers> = {
    instruction: statement,
    startStatement: `f(x) = ${image}`,
    answer,
    keys: ["x", "equal"],
    answerFormat: "tex",
    identifiers: { poly1: polynome1.coefficients, xValue },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, poly1, xValue },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const poly = new Polynomial(poly1);
  const image = poly.calculate(xValue);
  tryToAddWrongProp(propositions, "x=" + image);
  while (propositions.length < n) {
    const wrongAnswer = xValue + randint(-10, 11, [0]);
    tryToAddWrongProp(propositions, "x=" + wrongAnswer);
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return [answer, answer.split("=")[1]].includes(ans);
};

export const inverseImageFunction: Exercise<Identifiers> = {
  id: "inverseImageFunction",
  connector: "\\iff",
  getPropositions,
  label: "Calculer des antécédents",
  levels: ["3ème", "2nde", "CAP", "2ndPro", "1rePro", "1reTech"],
  sections: ["Fonctions"],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getInverseImageFunction, nb),
  qcmTimer: 60,
  freeTimer: 60,
  isAnswerValid,
  subject: "Mathématiques",
};
