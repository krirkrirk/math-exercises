"use strict";
exports.__esModule = true;
exports.NodeType = void 0;
var NodeType;
(function (NodeType) {
    NodeType[NodeType["number"] = 0] = "number";
    NodeType[NodeType["variable"] = 1] = "variable";
    NodeType[NodeType["operator"] = 2] = "operator";
    NodeType[NodeType["function"] = 3] = "function";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
