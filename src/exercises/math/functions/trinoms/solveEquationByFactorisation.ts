import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';

type Identifiers = {
};

const getSolveEquationByFactorisationQuestion: QuestionGenerator<Identifiers>  = ()=>{
 
  const question: Question<Identifiers> = {
    answer,
    instruction: ``,
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

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, {ggbAnswer}) => {
  throw Error("GGBVea not implemented")
}
export const solveEquationByFactorisation: Exercise<Identifiers> = {
  id: 'solveEquationByFactorisation',
  connector: "",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getSolveEquationByFactorisationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  isGGBAnswerValid,
  subject: "Mathématiques"
};
