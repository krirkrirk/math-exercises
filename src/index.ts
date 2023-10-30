import { MathExercise, MathSection } from './exercises/exercise';
import { exercises } from './exercises/exercises';
import { decimalToScientific } from './exercises/powers/decimalToScientific';

const allMathExercises = [...exercises];

const getAllMathExercisesBySection = () => {
  const data: { section: MathSection; exos: MathExercise[] }[] = [];

  allMathExercises.forEach((exo) => {
    const sectionsData = data.filter((el) => exo.sections.includes(el.section));
    if (!sectionsData.length) {
      exo.sections.forEach((section) =>
        data.push({
          section,
          exos: [exo],
        }),
      );
    } else {
      sectionsData.forEach((sectionData) => {
        data.find((d) => d.section === sectionData.section)?.exos.push(exo);
      });
    }
  });
  return data;
};

console.log(decimalToScientific.generator(10).forEach((q) => q.getPropositions(4)));

export { allMathExercises, getAllMathExercisesBySection };
