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

const getForLoopQuestion: QuestionGenerator<Identifiers>  = ()=>{
 
  const question: Question<Identifiers> = {
    answer,
    instruction: `Qu’affichera le programme suivant ? `,
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
export const forLoop: Exercise<Identifiers> = {
  id: 'forLoop',
  label: "",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Python"],
  generator: (nb: number) => getDistinctQuestions(getForLoopQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques"
};
