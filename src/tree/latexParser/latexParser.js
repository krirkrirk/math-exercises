"use strict";
exports.__esModule = true;
exports.LatexParser = void 0;
var node_1 = require("../nodes/node");
var LatexParser = /** @class */ (function () {
    function LatexParser() {
    }
    LatexParser.prototype.parse = function (node) {
        if (node === null)
            return "";
        switch (node.type) {
            case node_1.NodeType.variable:
                return node.tex;
            case node_1.NodeType.number:
                return node.tex;
            case node_1.NodeType.operator:
                switch (node.id) {
                    case "add":
                        var rightTex = this.parse(node.rightChild);
                        return "".concat(this.parse(node.leftChild), " ").concat(rightTex[0] === "-" ? "" : "+", " ").concat(rightTex);
                    case "multiply":
                        return node.tex;
                    default:
                        return node.tex;
                }
                break;
            default:
                break;
        }
        return "";
    };
    return LatexParser;
}());
exports.LatexParser = LatexParser;
