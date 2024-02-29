# math-exercises

This is a generator of Math exercises for middle school and high school.

So far, exercises are written in French, but any translation is welcome !

This library is used by [Mathlive.fr](https://www.mathlive.fr) for collaborative quizzes.

## 🚧 Work in progress !

This library is still in beta and the architecture may very well completely change in the future.

Incoming improvements :

- Random images generation using tikZ

- Steps within answers

- Coverage of all topics up to 12th grade

- Better classification of exercises

## Exercises format

Each MathExercise has a `generator` that will return distinct questions for this exercise.

The Question in itself has an `instruction`, a `startStatement` and an `answer` (which are all tex strings).

You can see all the exercises implemented so far [by playing with the select input here](https://www.mathlive.fr/teacher/createActivity/quizCollab/623366c277e90f70691aee70/).

## How to use

Example with (ax+b)^2 questions :

```js
import { firstIdentity } from 'exercises/calculLitteral/distributivity/firstIdentity';

console.log(firstIdentity.instruction);
const question = firstIdentity.generator(1);
console.log(question.startStatement);
console.log(question.answer);

//output :
// Développer et réduire :
// (2x+3)^2
// 4x^2 + 12x + 9
```

Some exercises do not have instructions, because the instruction is directly in the question itself.

A list of all exercises is exported from root.

## Expression tree and latex parser

Math expressions are implemented via a tree of Nodes that you'll find inside `tree/nodes`.

Any expression can be turned into a valid latex output via the `.toTex()` method.

They also can be simplified via the `simplifyNode` method.

## Math objects

This library also aims to implement pretty much all mathematical objects and notions up to 12th grade : all types of numbers and operations on them, but also points, vectors, polynomials, sets... Thus it can also be used for basic mathematics work.

## Minimal dependencies

We're trying to keep to our dependencies to a minimum. So far we're only using mathjs as an external library, to evaluate and simplify expression trees. We would love to have our own way of simplifying expressions in the future.

## How to contribute

Any contribution is welcomed.

There are tons of exercises left to implement !
