// import { Vector } from "../../../geometry/vector";
// import { distinctRandTupleInt } from "../../../mathutils/random/randTupleInt";
// import { NumberNode } from "../../../tree/nodes/numbers/numberNode";
// import { latexParser } from "../../../tree/parsers/latexParser";
// import { Exercise, Question } from "../../exercise";
// import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

// export const scalarProductViaNorms : Exercise = {
//     id: 'scalarProductViaNorms',
//     connector: "=",
//     instruction: "",
//     isSingleStep: false,
//     label: "Calculer un produit scalaire à l'aide des normes.",
//     levels: ["1, 0"],
//     section: "vectors",
//     generator: (nb: number) => getDistinctQuestions(getScalarProductViaNormsQuestion, nb)
// }

// export function getScalarProductViaNormsQuestion(): Question {
//     const [coords1, coords2] = distinctRandTupleInt(2, 2, {from: -9, to: 10})
//     const u = new Vector("u", new NumberNode(coords1[0]), new NumberNode(coords1[1]))
//     const v = new Vector("v", new NumberNode(coords2[0]), new NumberNode(coords2[1]))
//     return {
//         instruction: `Soit ${u.toTexWithCoords()} et ${v.toTexWithCoords()}. Calculer ${u.toTex()}\\cdot ${v.toTex()}.`,
//         startStatement: `${u.toTex()}\\cdot ${v.toTex()}`,
//         answer: latexParser(u.scalarProduct(v)),
//     }
// }