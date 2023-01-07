"use strict";
exports.__esModule = true;
exports.latexParse = void 0;
var node_1 = require("../nodes/node");
function latexParse(node) {
    if (!node) {
        console.log("parsing a null node ???");
        return "";
    }
    switch (node.type) {
        case node_1.NodeType.variable:
            return node.tex;
        case node_1.NodeType.number:
            return node.tex;
        case node_1.NodeType.operator:
            var rightTex = latexParse(node.rightChild);
            var leftTex = latexParse(node.leftChild);
            var leftChild = node.leftChild, rightChild = node.rightChild;
            switch (node.id) {
                case "add":
                    return "".concat(leftTex, " ").concat(rightTex[0] === "-" ? "" : "+ ").concat(rightTex);
                case "opposite":
                    var needBrackets = leftChild.id === "add" ||
                        leftChild.id === "substract" ||
                        leftTex[0] === "-";
                    if (needBrackets)
                        leftTex = "(".concat(leftTex, ")");
                    return "-".concat(leftTex);
                case "substract": {
                    var needBrackets_1 = rightChild.id === "add" ||
                        rightChild.id === "substract" ||
                        rightTex[0] === "-";
                    if (needBrackets_1)
                        rightTex = "(".concat(rightTex, ")");
                    return "".concat(leftTex, " - ").concat(rightTex);
                }
                case "multiply": {
                    if (leftChild.id === "add" || leftChild.id === "substract")
                        leftTex = "(".concat(leftTex, ")");
                    var needBrackets_2 = rightChild.id === "add" ||
                        rightChild.id === "substract" ||
                        rightTex[0] === "-";
                    if (needBrackets_2)
                        rightTex = "(".concat(rightTex, ")");
                    var showTimesSign = !isNaN(+rightTex[0]); //permet de gérer le cas 3*2^x
                    return "".concat(leftTex).concat(showTimesSign ? "\\times " : "").concat(rightTex);
                }
                case "divide": {
                    return "\\frac{".concat(leftTex, "}{").concat(rightTex, "}");
                }
                case "power": {
                    if (leftChild.id === "add" ||
                        leftChild.id === "substract" ||
                        leftChild.id === "multiply")
                        leftTex = "(".concat(leftTex, ")");
                    return "".concat(leftTex, "^{").concat(rightTex, "}");
                }
                case "equal": {
                    return "".concat(leftTex, " = ").concat(rightTex);
                }
                default:
                    return node.tex;
            }
        case node_1.NodeType["function"]: {
            var leftTex_1 = latexParse(node.leftChild);
            switch (node.id) {
                case "sqrt": {
                    return "\\sqrt{".concat(leftTex_1, "}");
                }
            }
        }
        default:
            return "";
    }
}
exports.latexParse = latexParse;
