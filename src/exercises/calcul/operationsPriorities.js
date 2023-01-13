"use strict";
exports.__esModule = true;
exports.getPriorityQuestions = exports.operationsPriorities = void 0;
var randint_1 = require("../../mathutils/random/randint");
var latexParse_1 = require("../../tree/latexParser/latexParse");
var numberNode_1 = require("../../tree/nodes/numbers/numberNode");
var addNode_1 = require("../../tree/nodes/operators/addNode");
var divideNode_1 = require("../../tree/nodes/operators/divideNode");
var multiplyNode_1 = require("../../tree/nodes/operators/multiplyNode");
var coin_1 = require("../../utils/coin");
var getDistinctQuestions_1 = require("../utils/getDistinctQuestions");
/**
 * a*b ±c±d
 * a/b ±c±d
 * a*b*c ± d
 * a*b±c*d
 * a/b ± c*d
 */
exports.operationsPriorities = {
    id: "operationsPriorities",
    connector: "=",
    instruction: "Calculer :",
    label: "Priorités opératoires",
    levels: ["6", "5", "4"],
    section: "Calculs",
    isSingleStep: true,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getPriorityQuestions, nb); }
};
function getPriorityQuestions() {
    var _a, _b, _c, _d, _e, _f, _g;
    var type = (0, randint_1.randint)(1, 6);
    var statement;
    var answer = "";
    var a, b, c, d;
    switch (type) {
        case 1: // a*b ±c±d
            _a = [1, 2, 3, 4].map(function (el) { return (0, randint_1.randint)(-10, 11, [0]); }), c = _a[0], d = _a[1];
            _b = [1, 2].map(function (el) { return (0, randint_1.randint)(-10, 11); }), a = _b[0], b = _b[1];
            statement = (0, coin_1.coin)()
                ? //a*b first ou last
                    new addNode_1.AddNode(new multiplyNode_1.MultiplyNode(new numberNode_1.NumberNode(a), new numberNode_1.NumberNode(b)), new addNode_1.AddNode(new numberNode_1.NumberNode(c), new numberNode_1.NumberNode(d))).shuffle()
                : //a*b middle
                    new addNode_1.AddNode(new addNode_1.AddNode(new numberNode_1.NumberNode(c), new multiplyNode_1.MultiplyNode(new numberNode_1.NumberNode(a), new numberNode_1.NumberNode(b))), new numberNode_1.NumberNode(d));
            answer = (a * b + c + d).toString();
            console.log("type", type);
            console.log("statement", statement);
            console.log("answer", answer);
            break;
        case 2: // a/b ±c±d
            _c = [1, 2, 3].map(function (el) { return (0, randint_1.randint)(-10, 11, [0]); }), b = _c[0], c = _c[1], d = _c[2];
            a = b * (0, randint_1.randint)(0, 11);
            statement = (0, coin_1.coin)()
                ? //a/b first ou last
                    new addNode_1.AddNode(new divideNode_1.DivideNode(new numberNode_1.NumberNode(a), new numberNode_1.NumberNode(b)), new addNode_1.AddNode(new numberNode_1.NumberNode(c), new numberNode_1.NumberNode(d))).shuffle()
                : //a/b middle
                    new addNode_1.AddNode(new addNode_1.AddNode(new numberNode_1.NumberNode(c), new divideNode_1.DivideNode(new numberNode_1.NumberNode(a), new numberNode_1.NumberNode(b))), new numberNode_1.NumberNode(d));
            answer = (a / b + c + d).toString();
            console.log("type", type);
            console.log("statement", statement);
            console.log("answer", answer);
            break;
        case 3: // a*b ± c*d
            _d = [1, 2, 3, 4].map(function (el) { return (0, randint_1.randint)(-10, 11); }), a = _d[0], b = _d[1], c = _d[2], d = _d[3];
            statement = new addNode_1.AddNode(new multiplyNode_1.MultiplyNode(new numberNode_1.NumberNode(a), new numberNode_1.NumberNode(b)), new multiplyNode_1.MultiplyNode(new numberNode_1.NumberNode(c), new numberNode_1.NumberNode(d)));
            answer = (a * b + c * d).toString();
            console.log("type", type);
            console.log("statement", statement);
            console.log("answer", answer);
            break;
        case 4: // a*b ± c/d
            _e = [1, 2].map(function (el) { return (0, randint_1.randint)(-10, 11); }), a = _e[0], b = _e[1];
            d = (0, randint_1.randint)(-10, 11, [0]);
            c = d * (0, randint_1.randint)(0, 11);
            statement = new addNode_1.AddNode(new multiplyNode_1.MultiplyNode(new numberNode_1.NumberNode(a), new numberNode_1.NumberNode(b)), new divideNode_1.DivideNode(new numberNode_1.NumberNode(c), new numberNode_1.NumberNode(d))).shuffle();
            answer = (a * b + c / d).toString();
            console.log("type", type);
            console.log("statement", statement);
            console.log("answer", answer);
            break;
        case 5: // a/b ± c/d
            _f = [1, 2].map(function (el) { return (0, randint_1.randint)(-10, 11, [0]); }), b = _f[0], d = _f[1];
            a = b * (0, randint_1.randint)(0, 11);
            c = d * (0, randint_1.randint)(0, 11);
            statement = new addNode_1.AddNode(new divideNode_1.DivideNode(new numberNode_1.NumberNode(a), new numberNode_1.NumberNode(b)), new divideNode_1.DivideNode(new numberNode_1.NumberNode(c), new numberNode_1.NumberNode(d)));
            answer = (a / b + c / d).toString();
            console.log("type", type);
            console.log("statement", statement);
            console.log("answer", answer);
            break;
        case 5: // a*b*c ± d
            _g = [1, 2].map(function (el) { return (0, randint_1.randint)(-10, 11, [0]); }), b = _g[0], d = _g[1];
            a = b * (0, randint_1.randint)(0, 11);
            c = d * (0, randint_1.randint)(0, 11);
            statement = new addNode_1.AddNode(new multiplyNode_1.MultiplyNode(new multiplyNode_1.MultiplyNode(new numberNode_1.NumberNode(a), new numberNode_1.NumberNode(b)), new numberNode_1.NumberNode(c)), new numberNode_1.NumberNode(d)).shuffle();
            answer = a * b * c + d + "";
            console.log("type", type);
            console.log("statement", statement.toString());
            console.log("answer", answer);
            break;
    }
    var question = {
        statement: (0, latexParse_1.latexParse)(statement),
        answer: answer
    };
    return question;
}
exports.getPriorityQuestions = getPriorityQuestions;
