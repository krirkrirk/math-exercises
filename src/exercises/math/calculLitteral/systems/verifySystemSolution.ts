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
import { System, SystemConstructor } from "#root/math/systems/system";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  sysCoeffs: number[][];
  x: number;
  y: number;
};

const getVerifySystemSolutionQuestion: QuestionGenerator<Identifiers> = () => {
  let x: number;
  let y: number;
  const isSolution = coinFlip();
  let sys: System;
  if (isSolution) {
    sys = SystemConstructor.niceValues();
    const sol = sys.solve();
    x = sol.x.evaluate({});
    y = sol.y.evaluate({});
  } else {
    sys = SystemConstructor.niceValues();
    const sol = sys.solve();
    x = sol.x.evaluate({}) + randint(-5, 5);
    y = sol.y.evaluate({}) + randint(-5, 5, [0]);
  }
  const question: Question<Identifiers> = {
    answer: isSolution ? "Oui" : "Non",
    instruction: `Soit le système d'équations suivant :
  
$${sys.toTex()}$
    
Le couple $(${x};${y})$ est-il une solution de ce système ?`,
    keys: [],
    answerFormat: "raw",
    identifiers: { sysCoeffs: sys.coeffs, x, y },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Oui", "raw");
  tryToAddWrongProp(propositions, "Non", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const verifySystemSolution: Exercise<Identifiers> = {
  id: "verifySystemSolution",
  label: "Vérifier si un couple est solution d'un système",
  levels: ["2nde", "1reSpé"],
  isSingleStep: true,
  sections: ["Systèmes"],
  generator: (nb: number) =>
    getDistinctQuestions(getVerifySystemSolutionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  answerType: "QCU",
};
