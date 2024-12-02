// import {
//     Exercise,
//     Proposition,
//     QCMGenerator,
//     Question,
//     QuestionGenerator,
//     VEA,
//     GGBVEA,
//     addValidProp,
//     shuffleProps,
//     tryToAddWrongProp,
//     GetAnswer,
//     GetHint,
//     GetCorrection,
//     GetInstruction,
//     GetKeys,
//     GetGGBOptions,
//     GetStudentGGBOptions,
//     GetGGBAnswer,
//   } from '#root/exercises/exercise';
//   import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';

//   type Identifiers = {
//     planName: string;
//     lineName: string;
//     positionRelative: string;
//   };

//   const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
//     const propositions: Proposition[] = [];
//     addValidProp(propositions, answer);
//     while (propositions.length < n) {
//       throw Error("QCM not implemented")
//     }
//     return shuffleProps(propositions, n);
//   };

//   const getAnswer : GetAnswer<Identifiers> = (identifiers)=>{
//     return identifiers.positionRelative
//   }

//   const getInstruction : GetInstruction<Identifiers> = (identifiers)=>{

//   }

//   const getHint : GetHint<Identifiers> = (identifiers)=>{

//   }
//   const getCorrection : GetCorrection<Identifiers> = (identifiers)=>{

//   }

//   const getGGBOptions: GetGGBOptions<Identifiers> = (identifiers)=>{

//   }

//   const getKeys : GetKeys<Identifiers> = (identifiers)=>{
//     return []
//   }
//   const isAnswerValid: VEA<Identifiers> = (ans, {answer})=>{
//     throw Error("VEA not implemented")
//   }

//   const getLineAndPlaneRelativePositionQuestion: QuestionGenerator<Identifiers>  = (opts)=>{

//     const identifiers: Identifiers = {}
//     const question: Question<Identifiers> = {
//       answer: getAnswer(identifiers),
//       instruction: getInstruction(identifiers),
//       keys: getKeys(identifiers),
//       answerFormat: 'tex',
//       identifiers,
//       hint: getHint(identifiers),
//       correction: getCorrection(identifiers),
//       ggbOptions: getGGBOptions(identifiers)
//     };

//     return question;
//   }

//   export const lineAndPlaneRelativePosition: Exercise<Identifiers> = {
//     id: 'lineAndPlaneRelativePosition',
//     connector: "=",
//     label: "Déterminer la position relative d'une droite et d'un plan",
//     isSingleStep: true,
//     generator: (nb,opts) => getDistinctQuestions(()=>getLineAndPlaneRelativePositionQuestion(opts), nb),
//     qcmTimer: 60,
//     freeTimer: 60,
//     getPropositions,
//     isAnswerValid,
//     subject: "Mathématiques",
//     getHint,
//     getCorrection,
//     getInstruction,
//     getAnswer,
//     getGGBOptions,
//     answerType: "QCU"
//   };
