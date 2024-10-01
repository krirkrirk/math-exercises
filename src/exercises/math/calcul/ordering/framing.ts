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
// import {
//   Decimal,
//   DecimalConstructor,
// } from "#root/math/numbers/decimals/decimal";
// import { randint } from "#root/math/utils/random/randint";
// import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
// import { MultiEqualNode } from "#root/tree/nodes/equations/multiEqualNode";
// import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
// import { NodeConstructor } from "#root/tree/nodes/nodeConstructor";
// import { PiNode } from "#root/tree/nodes/numbers/piNode";
// import { AddNode } from "#root/tree/nodes/operators/addNode";
// import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
// import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
// import { PowerNode } from "#root/tree/nodes/operators/powerNode";
// import { coinFlip } from "#root/utils/coinFlip";
// import { random } from "#root/utils/random";

// type Identifiers = {
//   type: number;
//   nbIds: any;
//   nbValue: number;
//   pow: number;
// };

// //fraction: 1/3, 2/3, 1/6, 5/6, x/7
// //décimal
// const getFramingQuestion: QuestionGenerator<Identifiers> = () => {
//   const type = randint(1, 5);
//   let nb: AlgebraicNode;
//   const pow = -randint(1, 4);
//   let a: AlgebraicNode;
//   let b: AlgebraicNode;
//   let ev: number;
//   let dec: Decimal;
//   switch (type) {
//     case 1:
//       //CL(pi)
//       nb = new AddNode(
//         new MultiplyNode(
//           random([randint(-3, 0), randint(1, 4), 10, -10]).toTree(),
//           PiNode,
//         ),
//         randint(-10, 10).toTree(),
//       );
//       ev = nb.evaluate({});
//       dec = new Decimal(ev);
//       a = dec.toLowerBound(pow).toTree();
//       b = dec.toUpperBound(pow).toTree();
//       break;
//     case 2:
//       //CL(sqrt(2))
//       nb = new AddNode(
//         new MultiplyNode(
//           random([randint(-3, 0), randint(1, 4), 10, -10]).toTree(),
//           new SqrtNode((2).toTree()),
//         ),
//         randint(-10, 10).toTree(),
//       );
//       ev = nb.evaluate({});
//       dec = new Decimal(ev);
//       a = dec.toLowerBound(pow).toTree();
//       b = dec.toUpperBound(pow).toTree();
//       break;
//     case 3:
//       //fraction
//       nb = new AddNode(
//         new MultiplyNode(
//           random([randint(-2, 0), randint(1, 3), 10, -10]).toTree(),
//           random([
//             new FractionNode((1).toTree(), (3).toTree()),
//             new FractionNode((2).toTree(), (3).toTree()),
//           ]),
//           { forceTimesSign: true },
//         ),
//         randint(-10, 10).toTree(),
//       );
//       ev = nb.evaluate({});
//       dec = new Decimal(ev);
//       a = dec.toLowerBound(pow).toTree();
//       b = dec.toUpperBound(pow).toTree();
//       break;

//     case 4:
//     default:
//       dec = DecimalConstructor.random(-200, 200, randint(-pow, -pow + 3));
//       nb = dec.toTree();
//       a = dec.toLowerBound(pow).toTree();
//       b = dec.toUpperBound(pow).toTree();
//       break;
//   }
//   const answer = `${a.toTex()}<${nb.toTex()}<${b.toTex()}`;
//   const question: Question<Identifiers> = {
//     answer,
//     instruction: `Encadrer à $${new PowerNode(
//       (10).toTree(),
//       pow.toTree(),
//     ).toTex()}$ près le nombre suivant :

// $$
// ${nb.toTex()}
// $$

// Donner une réponse sous la forme $a<${nb.toTex()}<b$.

// ${
//   type === 2
//     ? "On rappelle que $\\sqrt 2 \\approx 1,41421$."
//     : type === 1
//     ? "On rappelle que $\\pi \\approx 3,  14159$."
//     : ""
// }`,
//     keys: [
//       "pi",
//       "inf",
//       "sup",
//       {
//         id: "custom",
//         label: nb.toTex(),
//         labelType: "tex",
//         mathfieldInstructions: {
//           method: "write",
//           content: nb.toTex(),
//         },
//       },
//     ],
//     answerFormat: "tex",
//     identifiers: {
//       type,
//       nbIds: nb.toIdentifiers(),
//       nbValue: nb.evaluate({}),
//       pow,
//     },
//   };

//   return question;
// };

// const getPropositions: QCMGenerator<Identifiers> = (
//   n,
//   { answer, nbIds, nbValue, pow },
// ) => {
//   const propositions: Proposition[] = [];
//   addValidProp(propositions, answer);
//   const dec = new Decimal(nbValue);
//   const node = NodeConstructor.fromIdentifiers(nbIds);
//   console.log(nbValue, pow);
//   while (propositions.length < n) {
//     const fakePower = -randint(1, 4, [pow]);
//     const fakeDec = new Decimal(dec.value * randint(-3, 3, [0, 1]));
//     coinFlip()
//       ? tryToAddWrongProp(
//           propositions,
//           `${dec.toLowerBound(fakePower).toTree().toTex()}<${node.toTex()}<${dec
//             .toUpperBound(fakePower)
//             .toTree()
//             .toTex()}`,
//         )
//       : tryToAddWrongProp(
//           propositions,
//           `${fakeDec
//             .toLowerBound(pow)
//             .toTree()
//             .toTex()}<${node.toTex()}<${fakeDec
//             .toUpperBound(pow)
//             .toTree()
//             .toTex()}`,
//         );
//   }
//   return shuffleProps(propositions, n);
// };

// const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
//   return ans === answer;
// };

// export const framing: Exercise<Identifiers> = {
//   id: "framing",
//   connector: "=",
//   label: "Encadrer un nombre réel à $10^{-n}$",
//   levels: [],
//   isSingleStep: true,
//   sections: [],
//   generator: (nb: number) => getDistinctQuestions(getFramingQuestion, nb),
//   qcmTimer: 60,
//   freeTimer: 60,
//   getPropositions,
//   isAnswerValid,
//   subject: "Mathématiques",
// };
