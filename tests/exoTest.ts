import { Exercise } from "../src/exercises/exercise";
import { questionTest } from "./questionTest";

export const exoTest = (exo: Exercise) => {
  console.log(exo.id);
  let qcmTime = -1;
  let veaTime = -1;
  let generatorTime = -1;
  try {
    expect(exo.label.length).toBeGreaterThan(0);
    let before = Date.now();
    console.log("generate questions");
    const questions = exo.generator(30);
    let after = Date.now();
    generatorTime = after - before;

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
      const times = questionTest(exo, question);
      qcmTime = times.qcmTime;
      veaTime = times.veaTime;
    });

    return {
      generatorTime,
      qcmTime,
      veaTime,
    };
  } catch (err) {
    console.log(exo.id, err);
    throw err;
  }
};
