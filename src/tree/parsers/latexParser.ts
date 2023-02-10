// import { FunctionNode, FunctionsIds } from "../nodes/functions/functionNode";
// import { Node, NodeType } from "../nodes/node";
// import { OperatorIds, OperatorNode } from "../nodes/operators/operatorNode";

// export function latexParser(node: Node): string {
//   if (!node) {
//     console.log("parsing a null node ???");
//     return "";
//   }
//   switch (node.type) {
//     case NodeType.variable:
//       return node.tex;
//     case NodeType.number:
//       return node.tex;
//     case NodeType.operator:
//       const operatorNode = node as OperatorNode;
//       let rightTex = latexParser(operatorNode.rightChild);
//       let leftTex = latexParser(operatorNode.leftChild);
//       const { leftChild, rightChild } = operatorNode;
//       switch (operatorNode.id) {
//         case OperatorIds.add:
//           return `${leftTex} ${rightTex[0] === "-" ? "" : "+ "}${rightTex}`;

//         case OperatorIds.substract: {
//           const needBrackets =
//             (rightChild.type === NodeType.operator &&
//               [OperatorIds.add, OperatorIds.substract].includes((rightChild as OperatorNode).id)) ||
//             rightTex[0] === "-";

//           if (needBrackets) rightTex = `(${rightTex})`;

//           return `${leftTex} - ${rightTex}`;
//         }

//         case OperatorIds.multiply: {
//           if (leftChild.type === NodeType.operator) {
//             if ([OperatorIds.add, OperatorIds.substract, OperatorIds.divide].includes((leftChild as OperatorNode).id))
//               leftTex = `(${leftTex})`;
//           }
//           let needBrackets = rightTex[0] === "-";
//           if (rightChild.type === NodeType.operator) {
//             const operatorRightChild = rightChild as OperatorNode;
//             needBrackets ||= [OperatorIds.add, OperatorIds.substract].includes(operatorRightChild.id);
//           }
//           if (needBrackets) rightTex = `(${rightTex})`;

//           //  permet de gérer le cas 3*2^x
//           let showTimesSign = !isNaN(+rightTex[0]) || rightChild.type === NodeType.number;
//           if (rightChild.type === NodeType.operator) {
//             const operatorRightChild = rightChild as OperatorNode;
//             showTimesSign ||= [OperatorIds.fraction].includes(operatorRightChild.id);
//           }
//           return `${leftTex}${showTimesSign ? "\\times " : ""}${rightTex}`;
//         }

//         case OperatorIds.divide: {
//           if (leftChild.type === NodeType.operator) {
//             if ([OperatorIds.add, OperatorIds.substract, OperatorIds.multiply].includes((leftChild as OperatorNode).id))
//               leftTex = `(${leftTex})`;
//           }
//           let needBrackets = rightTex[0] === "-";
//           if (rightChild.type === NodeType.operator) {
//             const operatorRightChild = rightChild as OperatorNode;
//             needBrackets ||= [OperatorIds.add, OperatorIds.substract].includes(operatorRightChild.id);
//           }
//           if (needBrackets) rightTex = `(${rightTex})`;

//           return `${leftTex} \\div ${rightTex}`;
//         }

//         case OperatorIds.fraction: {
//           return `\\frac{${leftTex}}{${rightTex}}`;
//         }

//         case OperatorIds.power: {
//           let needBrackets = leftTex[0] === "-";
//           if (leftChild.type === NodeType.operator) {
//             const childOperator = leftChild as OperatorNode;
//             needBrackets ||= [
//               OperatorIds.add,
//               OperatorIds.substract,
//               OperatorIds.multiply,
//               OperatorIds.divide,
//               OperatorIds.fraction,
//               OperatorIds.power,
//             ].includes(childOperator.id);
//           }
//           if (needBrackets) leftTex = `(${leftTex})`;
//           return `${leftTex}^{${rightTex}}`;
//         }

//         case OperatorIds.equal: {
//           return `${leftTex} = ${rightTex}`;
//         }
//         default:
//           return node.tex;
//       }

//     case NodeType.function: {
//       const functionNode = node as FunctionNode;
//       const child = functionNode.child;
//       let childTex = latexParser(functionNode.child);
//       switch (functionNode.id) {
//         case FunctionsIds.sqrt: {
//           return `\\sqrt{${childTex}}`;
//         }

//         case FunctionsIds.opposite: {
//           let needBrackets = childTex[0] === "-";
//           if (child.type === NodeType.operator) {
//             const operatorChild = child as OperatorNode;
//             needBrackets ||= [OperatorIds.add, OperatorIds.substract].includes(operatorChild.id);
//           }
//           if (needBrackets) childTex = `(${childTex})`;
//           return `-${childTex}`;
//         }
//       }
//     }
//     default:
//       return "";
//   }
// }
