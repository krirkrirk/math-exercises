import { Exercise, Question } from "../src/exercises/exercise";

export const questionTest = (exo: Exercise, question: Question) => {
  let qcmTime = -1;
  let veaTime = -1;
  if (exo.hasHintAndCorrection) {
    expect(question.hint).not.toBe(undefined);
    expect(question.hint).not.toBe("");
    expect(question.correction).not.toBe(undefined);
    expect(question.correction).not.toBe("");
  }
  if (question.hint || question.correction)
    expect(exo.hasHintAndCorrection).toBe(true);

  expect(question.identifiers).not.toBe(undefined);

  const dotDecimalPattern = /\d+\.\d+/;
  if (question.studentGgbOptions?.coords?.length) {
    expect(exo.answerType).toBe("GGB");
  }
  if (exo.answerType === "GGB") {
    expect(question.ggbAnswer).not.toBe(undefined);
    expect(question.studentGgbOptions?.coords?.length).toBeGreaterThan(0);
  } else expect(question.answer).not.toBe(undefined);
  if (question.answer) {
    expect(question.answer.match(dotDecimalPattern)).toBe(null);
    expect(question.answer.includes("[object Object]")).toBe(false);
  }

  expect(question.instruction?.length).not.toBe(0);
  expect(question.instruction.includes("[object Object]")).toBe(false);

  if (exo.hasGeogebra) {
    expect(question.ggbOptions?.coords?.length).toBeGreaterThan(0);
  }
  if (question.ggbOptions) {
    expect(exo.hasGeogebra).toBe(true);
  }
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
    const answer = question.answer!;
    let before = Date.now();
    console.log("will test vea : ", exo.id);
    expect(
      exo.isAnswerValid!(answer, {
        answer,
        ...question.identifiers,
      }),
    ).toBe(true);
    let after = Date.now();
    veaTime = after - before;
  }

  if (exo.answerType !== "free" && exo.answerType !== "GGB") {
    let before = Date.now();
    console.log("will generate props : ", exo.id);
    const props = exo.getPropositions!(4, {
      answer: question.answer!,
      ...question.identifiers,
    });
    let after = Date.now();
    qcmTime = after - before;
    expect(props.length).toBeLessThan(5);
    const rightAnswers = props.filter((prop) => prop.isRightAnswer).length;
    if (exo.isQCM) expect(rightAnswers).toBeGreaterThan(1);
    else {
      expect(rightAnswers).toBe(1);
    }
    props.forEach((prop) => {
      expect(prop.statement.match(dotDecimalPattern)).toBe(null);
      expect(prop.statement.includes("[object Object]")).toBe(false);
      expect(
        props.every(
          (prop2) => prop2.id === prop.id || prop.statement !== prop2.statement,
        ),
      ).toBe(true);
    });
    if (question.ggbOptions?.coords) {
      question.ggbOptions?.coords.forEach((element) => {
        expect(Math.abs(element)).toBeLessThan(Infinity);
      });
    }
  }
  return {
    veaTime,
    qcmTime,
  };
};
