"use strict";
exports.__esModule = true;
var discreteSet_1 = require("./sets/discreteSet");
var intervals_1 = require("./sets/intervals/intervals");
// const aff = new Affine(3, 5).add(new Affine(6, 8));
// console.log(aff.toTex());
// const pol = new Polynomial([5, 3]).multiply(new Polynomial([2, 4]));
// console.log(pol.toTex());
// const aff = AffineConstructor.random(new Interval({ tex: "]-10; 0[", type: NumberType.Integer }));
// console.log(aff.toTex());
var inter = new intervals_1.Interval("[[4;8]]").difference(new discreteSet_1.DiscreteSet([5]));
console.log(inter.getRandomElement());
/**
 * Latex([2, add, 3, multiply, 4]) --> 2+3*4
 * Latex([2, add, -3, multiply, -4]) --> 2 -3 *(-4)
 * Latex([-9, multiply, x, add, -5, equals, 67]) --> -9x-5 = 67
 * Latex([sqrt, 9]) --> sqrt(9)
 * Latex([[-3, *, x, +, 4], *, [2, *, x, +, 1]])  -->(-3x+4)(2x+1)
 * Latex.parenthesis([...phrase1])
 *
 *
 * muliply : switch(next item)
 *  - cas négatif : ajouter parenthses
 *  - cas symbol : pas de signe * (symbol = lettre x,y... ou parenthese ou ...)
 */
