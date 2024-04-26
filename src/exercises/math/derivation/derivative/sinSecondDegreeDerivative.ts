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

type Identifiers = {
};

const getSinSecondDegreeDerivativeQuestion: QuestionGenerator<Identifiers>  = ()=>{
 
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
export const sinSecondDegreeDerivative: Exercise<Identifiers> = {
  id: 'sinSecondDegreeDerivative',
  connector: "",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getSinSecondDegreeDerivativeQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques"
};
