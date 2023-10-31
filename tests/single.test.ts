import { rationalFracForbiddenValueLimit } from '../src/exercises/limits/rationalFracForbiddenValueLimit';
import { rationalFracLimit } from '../src/exercises/limits/rationalFracLimit';
test('one exo', () => {
  const exo = rationalFracForbiddenValueLimit;

  console.log(exo.id);
  try {
    const questions = exo.generator(50);
    questions.forEach((question) => {
      expect(question.instruction.length).not.toBe(0);
      expect(question.answer.length).not.toBe(0);

      const props = question.getPropositions(4);
      expect(props.length).toBe(4);
      expect(props.filter((prop) => prop.isRightAnswer).length).toBe(1);
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
});
