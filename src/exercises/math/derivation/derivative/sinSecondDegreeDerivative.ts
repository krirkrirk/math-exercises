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
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { SinNode } from '#root/tree/nodes/functions/sinNode';

type Identifiers = {
};

const getSinSecondDegreeDerivativeQuestion: QuestionGenerator<Identifiers>  = ()=>{

  const trinom = TrinomConstructor.random()
  const sin = new SinNode()
 
  const question: Question<Identifiers> = {
    answer: ,
    instruction: `Calculer la dérivée seconde de $sin(u)$`,
    keys: [],
    answerFormat: 'tex',
    identifiers : {}
  };

  return question;
}

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented")
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, {answer})=>{
  throw Error("VEA not implemented")
}
export const sinSecondDegreeDerivative: Exercise<Identifiers> = {
  id: 'sinSecondDegreeDerivative',
  label: "Calculer la dérivée seconde de sin(u)",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Dérivation"],
  generator: (nb: number) => getDistinctQuestions(getSinSecondDegreeDerivativeQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques"
};
