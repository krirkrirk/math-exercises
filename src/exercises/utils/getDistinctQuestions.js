"use strict";
exports.__esModule = true;
exports.getDistinctQuestions = void 0;
var getDistinctQuestions = function (generator, nb) {
    var res = [];
    var _loop_1 = function (i) {
        var question;
        do {
            question = generator();
        } while (res.some(function (q) { return q.statement === question.statement; }));
        res.push(question);
    };
    for (var i = 0; i < nb; i++) {
        _loop_1(i);
    }
    return res;
};
exports.getDistinctQuestions = getDistinctQuestions;
