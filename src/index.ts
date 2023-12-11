import { MathExercise, MathSection } from './exercises/exercise';
import { exercises } from './exercises/exercises';
import { decimalToScientific } from './exercises/powers/decimalToScientific';

/**
 * TODO
 * Décimal : permettre facilement -0.xxx
 * Tree shaking export
 * 
 * 

*/

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

export { allMathExercises, getAllMathExercisesBySection };
