import { exercises } from "../src/exercises/exercises";
test("all exos", () => {
  console.log(exercises.length);
  exercises.forEach((exo) => {
    console.log(exo.id);
    try {
      expect(exo.sections.length).not.toBe(0);
      expect(exo.levels.length).not.toBe(0);

      const questions = exo.generator(30);

      if (exo.answerType !== "free") {
        expect(exo.getPropositions).not.toBe(undefined);
      }
      if (exo.answerType !== "QCM") {
        expect(exo.isAnswerValid).not.toBe(undefined);
      }
      questions.forEach((question) => {
        expect(question.identifiers).not.toBe(undefined);
        const dotDecimalPattern = /\d+\.\d+/;
        expect(question.answer.match(dotDecimalPattern)).toBe(null);
        expect(question.instruction?.length).not.toBe(0);
        if (exo.answerType !== "QCM") {
          expect(question.keys).not.toBe(undefined);
          expect(
            exo.isAnswerValid!(question.answer, question.identifiers),
          ).toBe(true);
        }
        if (exo.answerType !== "free") {
          const props = exo.getPropositions!(4, question.identifiers);
          expect(props.length).toBe(4);
          expect(props.filter((prop) => prop.isRightAnswer).length).toBe(1);
          props.forEach((prop) =>
            expect(prop.statement.match(dotDecimalPattern)).toBe(null),
          );
        }
      });
    } catch (err) {
      console.log(exo.id);
      throw err;
    }
  });
});
