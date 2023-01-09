"use strict";
exports.__esModule = true;
exports.FunctionNode = exports.FunctionsIds = void 0;
var node_1 = require("../node");
var FunctionsIds;
(function (FunctionsIds) {
    FunctionsIds[FunctionsIds["opposite"] = 0] = "opposite";
    FunctionsIds[FunctionsIds["sqrt"] = 1] = "sqrt";
})(FunctionsIds = exports.FunctionsIds || (exports.FunctionsIds = {}));
var FunctionNode = /** @class */ (function () {
    function FunctionNode(id, child, tex) {
        this.type = node_1.NodeType["function"];
        this.id = id;
        this.child = child;
        this.tex = tex;
    }
    return FunctionNode;
}());
exports.FunctionNode = FunctionNode;
