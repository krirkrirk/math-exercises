import { exercises } from '../exercises';

test('all exos', () => {
  console.log(exercises.length);
  exercises.forEach((exo) => {
    console.log(exo.id);
    try {
      expect(exo.sections.length).not.toBe(0);
      expect(exo.levels.length).not.toBe(0);

      const questions = exo.generator(10);
      questions.forEach((question) => {
        const props = question.getPropositions(4);
        expect(props.length).toBe(4);
        expect(props.filter((prop) => prop.isRightAnswer).length).toBe(1);
      });
    } catch (err) {
      console.log(exo.id);
    }
  });
});
//40-*60
//100-120
