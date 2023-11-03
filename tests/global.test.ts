import { exercises } from '../src/exercises/exercises';
test('all exos', () => {
  console.log(exercises.length);
  exercises.forEach((exo) => {
    console.log(exo.id);
    try {
      expect(exo.sections.length).not.toBe(0);
      expect(exo.levels.length).not.toBe(0);
      const questions = exo.generator(30);
      questions.forEach((question) => {
        expect(question.instruction?.length).not.toBe(0);
        if (exo.answerType !== 'QCM') expect(question.keys).not.toBe(undefined);
        const props = question.getPropositions(4);

        expect(props.length).toBe(4);
        expect(props.filter((prop) => prop.isRightAnswer).length).toBe(1);
      });
    } catch (err) {
      console.log(exo.id);
      throw err;
    }
  });
});
