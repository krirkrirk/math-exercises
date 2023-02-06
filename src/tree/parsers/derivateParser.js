"use strict";
exports.__esModule = true;
exports.derivateParser = void 0;
var node_1 = require("../nodes/node");
var numberNode_1 = require("../nodes/numbers/numberNode");
var powerNode_1 = require("../nodes/operators/powerNode");
var addNode_1 = require("../nodes/operators/addNode");
var fractionNode_1 = require("../nodes/operators/fractionNode");
var multiplyNode_1 = require("../nodes/operators/multiplyNode");
var operatorNode_1 = require("../nodes/operators/operatorNode");
var substractNode_1 = require("../nodes/operators/substractNode");
var functionNode_1 = require("../nodes/functions/functionNode");
var sqrtNode_1 = require("../nodes/functions/sqrtNode");
var oppositeNode_1 = require("../nodes/functions/oppositeNode");
function derivateParser(node) {
    if (!node)
        throw Error("encountered a null node ??");
    switch (node.type) {
        case node_1.NodeType.variable:
            return new numberNode_1.NumberNode(1);
        case node_1.NodeType.number:
            return new numberNode_1.NumberNode(0);
        case node_1.NodeType.operator:
            var operatorNode = node;
            var u = operatorNode.leftChild;
            var v = operatorNode.rightChild;
            switch (operatorNode.id) {
                case operatorNode_1.OperatorIds.add:
                    return new addNode_1.AddNode(derivateParser(u), derivateParser(v));
                case operatorNode_1.OperatorIds.substract: {
                    return new substractNode_1.SubstractNode(derivateParser(u), derivateParser(v));
                }
                case operatorNode_1.OperatorIds.multiply: {
                    return new addNode_1.AddNode(new multiplyNode_1.MultiplyNode(derivateParser(u), v), new multiplyNode_1.MultiplyNode(u, derivateParser(v)));
                }
                case operatorNode_1.OperatorIds.divide:
                case operatorNode_1.OperatorIds.fraction:
                    return new fractionNode_1.FractionNode(new substractNode_1.SubstractNode(new multiplyNode_1.MultiplyNode(derivateParser(u), v), new multiplyNode_1.MultiplyNode(u, derivateParser(v))), new powerNode_1.PowerNode(v, new numberNode_1.NumberNode(2)));
                case operatorNode_1.OperatorIds.power: {
                    var operatorNode_2 = node;
                    var n = operatorNode_2.rightChild;
                    var u_1 = operatorNode_2.leftChild;
                    return new multiplyNode_1.MultiplyNode(n, new multiplyNode_1.MultiplyNode(derivateParser(u_1), new powerNode_1.PowerNode(u_1, new numberNode_1.NumberNode(n.value - 1))));
                }
            }
        case node_1.NodeType["function"]: {
            var functionNode = node;
            var child = functionNode.child;
            switch (functionNode.id) {
                case functionNode_1.FunctionsIds.sqrt: {
                    return new fractionNode_1.FractionNode(derivateParser(child), new multiplyNode_1.MultiplyNode(new numberNode_1.NumberNode(2), new sqrtNode_1.SqrtNode(child)));
                }
                case functionNode_1.FunctionsIds.opposite: {
                    return new oppositeNode_1.OppositeNode(derivateParser(child));
                }
            }
        }
    }
}
exports.derivateParser = derivateParser;
