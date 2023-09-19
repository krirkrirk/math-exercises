import { Exercise, MathSection } from './exercises/exercise';
import { exercises } from './exercises/exercises';
import { TrinomConstructor } from './math/polynomials/trinom';

const allMathExercises = [...exercises];

const getAllMathExercisesBySection = () => {
  const data: { section: MathSection; exos: Exercise[] }[] = [];

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

const trinom = TrinomConstructor.randomCanonical();
const answer = trinom.getSommet();
console.log(answer);
export { allMathExercises, getAllMathExercisesBySection };
