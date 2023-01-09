"use strict";
exports.__esModule = true;
exports.latexParse = void 0;
var functionNode_1 = require("../nodes/functions/functionNode");
var node_1 = require("../nodes/node");
var operatorNode_1 = require("../nodes/operators/operatorNode");
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
            var operatorNode = node;
            var rightTex = latexParse(operatorNode.rightChild);
            var leftTex = latexParse(operatorNode.leftChild);
            var leftChild = operatorNode.leftChild, rightChild = operatorNode.rightChild;
            switch (operatorNode.id) {
                case operatorNode_1.OperatorIds.add:
                    return "".concat(leftTex, " ").concat(rightTex[0] === "-" ? "" : "+ ").concat(rightTex);
                case operatorNode_1.OperatorIds.substract: {
                    var needBrackets = (rightChild.type === node_1.NodeType.operator &&
                        [operatorNode_1.OperatorIds.add, operatorNode_1.OperatorIds.substract].includes(rightChild.id)) ||
                        rightTex[0] === "-";
                    if (needBrackets)
                        rightTex = "(".concat(rightTex, ")");
                    return "".concat(leftTex, " - ").concat(rightTex);
                }
                case operatorNode_1.OperatorIds.multiply: {
                    if (leftChild.type === node_1.NodeType.operator) {
                        if ([operatorNode_1.OperatorIds.add, operatorNode_1.OperatorIds.substract, operatorNode_1.OperatorIds.divide].includes(leftChild.id))
                            leftTex = "(".concat(leftTex, ")");
                    }
                    var needBrackets = rightTex[0] === "-";
                    if (rightChild.type === node_1.NodeType.operator) {
                        var operatorRightChild = rightChild;
                        needBrackets || (needBrackets = [operatorNode_1.OperatorIds.add, operatorNode_1.OperatorIds.substract].includes(operatorRightChild.id));
                    }
                    if (needBrackets)
                        rightTex = "(".concat(rightTex, ")");
                    //  permet de gérer le cas 3*2^x
                    var showTimesSign = !isNaN(+rightTex[0]) || rightChild.type === node_1.NodeType.number;
                    if (rightChild.type === node_1.NodeType.operator) {
                        var operatorRightChild = rightChild;
                        showTimesSign || (showTimesSign = [operatorNode_1.OperatorIds.fraction].includes(operatorRightChild.id));
                    }
                    return "".concat(leftTex).concat(showTimesSign ? "\\times " : "").concat(rightTex);
                }
                case operatorNode_1.OperatorIds.divide: {
                    if (leftChild.type === node_1.NodeType.operator) {
                        if ([operatorNode_1.OperatorIds.add, operatorNode_1.OperatorIds.substract, operatorNode_1.OperatorIds.multiply].includes(leftChild.id))
                            leftTex = "(".concat(leftTex, ")");
                    }
                    var needBrackets = rightTex[0] === "-";
                    if (rightChild.type === node_1.NodeType.operator) {
                        var operatorRightChild = rightChild;
                        needBrackets || (needBrackets = [operatorNode_1.OperatorIds.add, operatorNode_1.OperatorIds.substract].includes(operatorRightChild.id));
                    }
                    if (needBrackets)
                        rightTex = "(".concat(rightTex, ")");
                    //  permet de gérer le cas 3*2^x
                    var showTimesSign = !isNaN(+rightTex[0]);
                    if (rightChild.type === node_1.NodeType.operator) {
                        var operatorRightChild = rightChild;
                        showTimesSign || (showTimesSign = [operatorNode_1.OperatorIds.fraction].includes(operatorRightChild.id));
                    }
                    return "".concat(leftTex).concat(showTimesSign ? "\\div " : "").concat(rightTex);
                }
                case operatorNode_1.OperatorIds.fraction: {
                    return "\\frac{".concat(leftTex, "}{").concat(rightTex, "}");
                }
                case operatorNode_1.OperatorIds.power: {
                    var needBrackets = leftTex[0] === "-";
                    if (leftChild.type === node_1.NodeType.operator) {
                        var childOperator = leftChild;
                        needBrackets || (needBrackets = [
                            operatorNode_1.OperatorIds.add,
                            operatorNode_1.OperatorIds.substract,
                            operatorNode_1.OperatorIds.multiply,
                            operatorNode_1.OperatorIds.divide,
                            operatorNode_1.OperatorIds.fraction,
                            operatorNode_1.OperatorIds.power,
                        ].includes(childOperator.id));
                    }
                    if (needBrackets)
                        leftTex = "(".concat(leftTex, ")");
                    return "".concat(leftTex, "^{").concat(rightTex, "}");
                }
                case operatorNode_1.OperatorIds.equal: {
                    return "".concat(leftTex, " = ").concat(rightTex);
                }
                default:
                    return node.tex;
            }
        case node_1.NodeType["function"]: {
            var functionNode = node;
            var child = functionNode.child;
            var childTex = latexParse(functionNode.child);
            switch (functionNode.id) {
                case functionNode_1.FunctionsIds.sqrt: {
                    return "\\sqrt{".concat(childTex, "}");
                }
                case functionNode_1.FunctionsIds.opposite: {
                    var needBrackets = childTex[0] === "-";
                    if (child.type === node_1.NodeType.operator) {
                        var operatorChild = child;
                        needBrackets || (needBrackets = [operatorNode_1.OperatorIds.add, operatorNode_1.OperatorIds.substract].includes(operatorChild.id));
                    }
                    if (needBrackets)
                        childTex = "(".concat(childTex, ")");
                    return "-".concat(childTex);
                }
            }
        }
        default:
            return "";
    }
}
exports.latexParse = latexParse;
