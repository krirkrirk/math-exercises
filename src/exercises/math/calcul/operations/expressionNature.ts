// import {
//   Exercise,
//   Proposition,
//   QCMGenerator,
//   Question,
//   QuestionGenerator,
//   VEA,
//   GGBVEA,
//   addValidProp,
//   shuffleProps,
//   tryToAddWrongProp,
// } from "#root/exercises/exercise";
// import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
// import { AddNode } from "#root/tree/nodes/operators/addNode";
// import { diceFlip } from "#root/utils/diceFlip";

// type Identifiers = {};

// const getExpressionNatureQuestion: QuestionGenerator<Identifiers> = () => {
//   let answer  = "";
//   let statement = "";
//   let numbers = [0, 0];
//   const type = diceFlip(4)
//   switch(type){
//     case 0 :
//       //somme
//       //ab+c , ac + bc, a/b + c, a + b/c
//       const node= new AddNode(

//       )
//       answer = "une somme"
//     break;
//     case 1 :
//       //différence
//       answer = "une différence"
//     break;
//     case 2 :
//       //produit
//       answer = "un produit"
//     break;
//     case 3 :
//     default:
//       //quotient
//       answer = "un quotient"
//     break;
//   }
//   const question: Question<Identifiers> = {
//     answer,
//     instruction: `L'expression ${statement} est : `,
//     keys: [],
//     answerFormat: "tex",
//     identifiers: {},
//   };

//   return question;
// };

// const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
//   const propositions: Proposition[] = [];
//   addValidProp(propositions, answer);
//   tryToAddWrongProp(propositions, "une somme");
//   tryToAddWrongProp(propositions, "un produit");
//   tryToAddWrongProp(propositions, "une différence");
//   tryToAddWrongProp(propositions, "un quotient");
//   return shuffleProps(propositions, n);
// };

// const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
//   return ans === answer;
// };

// export const expressionNature: Exercise<Identifiers> = {
//   id: "expressionNature",
//   connector: "=",
//   label:
//     "Déterminer la nature d'une expression (somme/produit/différence/quotient)",
//   levels: [],
//   isSingleStep: true,
//   sections: [],
//   generator: (nb: number) =>
//     getDistinctQuestions(getExpressionNatureQuestion, nb),
//   qcmTimer: 60,
//   freeTimer: 60,
//   getPropositions,
//   isAnswerValid,
//   subject: "Mathématiques",
// };
