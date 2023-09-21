import { Exercise, MathSection } from './exercises/exercise';
import { exercises } from './exercises/exercises';
import { Complex } from './math/complex/complex';
import { TrinomConstructor } from './math/polynomials/trinom';
import { ComplexNode } from './tree/nodes/complex/complexNode';
import { AddNode } from './tree/nodes/operators/addNode';
import { MultiplyNode } from './tree/nodes/operators/multiplyNode';
import { simplifyComplex } from './tree/parsers/simplify';

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

export { allMathExercises, getAllMathExercisesBySection };
