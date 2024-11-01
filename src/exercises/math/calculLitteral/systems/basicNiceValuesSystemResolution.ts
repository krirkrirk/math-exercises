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
import { RationalConstructor } from "#root/math/numbers/rationals/rational";
import { System, SystemConstructor } from "#root/math/systems/system";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  coeffs: number[][];
  isXAsked: boolean;
};

//{ a1x + b1y = c1 , a2x + b2y = c2}

const getBasicNiceValuesSystemResolutionQuestion: QuestionGenerator<
  Identifiers
> = () => {
  //need a1/b1 != a2/b2
  const sys = SystemConstructor.niceValues();
  const { x, y } = sys.solve();
  const isXAsked = coinFlip();
  const variable = isXAsked ? "x" : "y";
  const answer = isXAsked ? x.toTex() : y.toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit le système d'équations suivant :
  
$$
${sys.toTex()}
$$
  
  Que vaut $${variable}$ ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: { coeffs: sys.coeffs, isXAsked },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, coeffs, isXAsked },
) => {
  const propositions: Proposition[] = [];
  const sys = new System(coeffs);
  const { x, y } = sys.solve();
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, isXAsked ? y.toTex() : x.toTex());
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 11) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, coeffs, isXAsked }) => {
  return ans === answer;
};
export const basicNiceValuesSystemResolution: Exercise<Identifiers> = {
  id: "basicNiceValuesSystemResolution",
  connector: "=",
  label: "Résoudre un système d'équations (solutions entières)",
  levels: ["2nde", "1reSpé"],
  isSingleStep: true,
  sections: ["Systèmes"],
  generator: (nb: number) =>
    getDistinctQuestions(getBasicNiceValuesSystemResolutionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
