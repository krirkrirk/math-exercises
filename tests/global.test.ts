import { AlgebraicNode } from "../src/tree/nodes/algebraicNode";
import * as MathExercises from "./../src/exercises/math";
import * as PCExercises from "./../src/exercises/pc";

import { Exercise } from "./../src/exercises/exercise";
import { NumberNode } from "./../src/tree/nodes/numbers/numberNode";
import { MinusInfinityNode } from "./../src/tree/nodes/numbers/infiniteNode";
import { PlusInfinityNode } from "./../src/tree/nodes/numbers/infiniteNode";
import { toScientific } from "../src/utils/numberPrototype/toScientific";

const mathExercises = Object.values(MathExercises) as Exercise<any>[];
const pcExercises = Object.values(PCExercises) as Exercise<any>[];

type Worst = {
  exoId: string;
  time: number;
};
declare global {
  interface Number {
    toTree: () => AlgebraicNode;
    frenchify: () => string;
    toScientific: (decimals?: number) => AlgebraicNode;
  }
}

Number.prototype.toTree = function (): AlgebraicNode {
  const value = this.valueOf();
  if (value === Infinity) return PlusInfinityNode;
  if (value === -Infinity) return MinusInfinityNode;
  return new NumberNode(value);
};
Number.prototype.frenchify = function (): string {
  return (this.valueOf() + "").replace(".", ",");
};
Number.prototype.toScientific = function (decimals?: number): AlgebraicNode {
  return toScientific(this.valueOf(), decimals);
};

test("all exos", () => {
  const questionsGenerationTimes: number[] = [];
  let worstQuestionGenerationTime: Worst = { exoId: "", time: 0 };
  const qcmGenerationTimes: number[] = [];
  let worstQCMGenerationTime: Worst = { exoId: "", time: 0 };
  const veaTimes: number[] = [];
  let worstVEATime: Worst = { exoId: "", time: 0 };
  const ggbVeaTimes: number[] = [];
  let worstGGBVEATime: Worst = { exoId: "", time: 0 };
  const allExos = [...mathExercises, ...pcExercises];
  // const allExos = [MathExercises.inflexionPointQuadrinomials];
  allExos.forEach((exo) => {
    console.log(exo.id);
    try {
      expect(exo.label.length).toBeGreaterThan(0);
      let before = Date.now();
      console.log("generate questions");
      const questions = exo.generator(30);
      let after = Date.now();
      let time = after - before;
      questionsGenerationTimes.push(time);
      if (worstQuestionGenerationTime.time < time) {
        worstQuestionGenerationTime = {
          exoId: exo.id,
          time,
        };
      }
      if (exo.answerType !== "free" && exo.answerType !== "GGB") {
        expect(exo.getPropositions).not.toBe(undefined);
      }
      if (
        exo.answerType !== "QCM" &&
        exo.answerType !== "QCU" &&
        exo.answerType !== "GGB"
      ) {
        expect(exo.isAnswerValid).not.toBe(undefined);
      }
      if (exo.answerType === "GGB") {
        expect(exo.isGGBAnswerValid).not.toBe(undefined);
      }
      questions.forEach((question) => {
        expect(question.identifiers).not.toBe(undefined);
        expect(question.identifiers).not.toBe(undefined);

        const dotDecimalPattern = /\d+\.\d+/;
        if (exo.answerType === "GGB") {
          expect(question.ggbAnswer).not.toBe(undefined);
        } else expect(question.answer).not.toBe(undefined);
        if (question.answer) {
          expect(question.answer.match(dotDecimalPattern)).toBe(null);
          expect(question.answer.includes("[object Object]")).toBe(false);
        }

        expect(question.instruction?.length).not.toBe(0);
        expect(question.instruction.includes("[object Object]")).toBe(false);
        //! probélamtique car la réponse crée par nous n'est pas toujours au même format que celle fourni par l'élève
        //! voir par ex drawAvector
        // if (exo.answerType === "GGB") {
        //   let before = Date.now();
        //   console.log("will test ggbVea");
        //   expect(
        //     exo.isGGBAnswerValid!(question.ggbAnswer!, {
        //       ggbAnswer: question.ggbAnswer,
        //       ...question.identifiers,
        //     }),
        //   ).toBe(true);
        //   let after = Date.now();
        //   let time = after - before;
        //   ggbVeaTimes.push(time);
        //   if (worstGGBVEATime.time < time) {
        //     worstGGBVEATime = {
        //       exoId: exo.id,
        //       time,
        //     };
        //   }
        // }
        if (
          exo.answerType !== "QCM" &&
          exo.answerType !== "QCU" &&
          exo.answerType !== "GGB"
        ) {
          expect(question.keys).not.toBe(undefined);

          let before = Date.now();
          console.log("will test vea");
          expect(
            exo.isAnswerValid!(question.answer!, {
              answer: question.answer,
              ...question.identifiers,
            }),
          ).toBe(true);
          let after = Date.now();
          let time = after - before;
          veaTimes.push(time);
          if (worstVEATime.time < time) {
            worstVEATime = {
              exoId: exo.id,
              time,
            };
          }
        }
        if (exo.answerType !== "free" && exo.answerType !== "GGB") {
          let before = Date.now();
          console.log("will generate props");
          const props = exo.getPropositions!(4, {
            answer: question.answer,
            ...question.identifiers,
          });
          let after = Date.now();
          let time = after - before;
          qcmGenerationTimes.push(time);
          if (worstQCMGenerationTime.time < time) {
            worstQCMGenerationTime = {
              exoId: exo.id,
              time,
            };
          }
          expect(props.length).toBeLessThan(5);
          expect(props.filter((prop) => prop.isRightAnswer).length).toBe(1);
          props.forEach((prop) => {
            expect(prop.statement.match(dotDecimalPattern)).toBe(null);
            expect(prop.statement.includes("[object Object]")).toBe(false);
          });
          if (question.coords) {
            question.coords.forEach((element) => {
              expect(Math.abs(element)).toBeLessThan(Infinity);
            });
          }
        }
      });
    } catch (err) {
      console.log(exo.id, err);
      throw err;
    }
  });
  console.log(
    "average ggbVea",
    ggbVeaTimes.reduce((acc, curr) => acc + curr, 0) / ggbVeaTimes.length,
  );
  console.log(
    "average vea",
    veaTimes.reduce((acc, curr) => acc + curr, 0) / veaTimes.length,
  );
  console.log(
    "average qcm",
    qcmGenerationTimes.reduce((acc, curr) => acc + curr, 0) /
      qcmGenerationTimes.length,
  );
  console.log(
    "average generator",
    questionsGenerationTimes.reduce((acc, curr) => acc + curr, 0) /
      questionsGenerationTimes.length,
  );
  console.log("worst qcm", worstQCMGenerationTime);
  console.log("worst vea", worstVEATime);
  console.log("worst ggbVea", worstGGBVEATime);
  console.log("worst generator", worstQuestionGenerationTime);
});
