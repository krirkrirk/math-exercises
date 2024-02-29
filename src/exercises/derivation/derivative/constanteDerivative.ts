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
import { NombreConstructor, NumberType } from "#root/math/numbers/nombre";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  tex: string;
};

export const getConstanteDerivative: QuestionGenerator<Identifiers> = () => {
  const c = NombreConstructor.random();
  const tex = c.toTree().toTex();
  const answer = "0";
  const question: Question<Identifiers> = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) = ${tex}$.`,
    startStatement: `f'(x)`,
    answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { tex },
  };

  return question;
};

export const getConstanteDerivativePropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, tex },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, tex);
  tryToAddWrongProp(propositions, "1");
  const opposite = tex[0] === "-" ? tex.slice(1) : "-" + tex;
  tryToAddWrongProp(propositions, `${opposite}`);
  tryToAddWrongProp(propositions, "x");

  while (propositions.length < n) {
    const wrongAnswer = randint(-9, 10);
    tryToAddWrongProp(propositions, wrongAnswer + "");
  }

  return shuffleProps(propositions, n);
};
export const isConstanteDerivativeAnswerValid: VEA<Identifiers> = (ans, {}) => {
  return ans === "0";
};

export const constanteDerivative: MathExercise<Identifiers> = {
  id: "constanteDerivative",
  connector: "=",
  label: "Dérivée d'une constante",
  levels: ["1reESM", "1reSpé", "1reTech", "MathComp", "1rePro"],
  sections: ["Dérivation"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getConstanteDerivative, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getConstanteDerivativePropositions,
  isAnswerValid: isConstanteDerivativeAnswerValid,
};
