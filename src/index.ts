import { exercises } from './exercises/exercises';
import { remarkableValuesExercise } from './exercises/trigonometry/remarkableValues';

exercises.forEach((exo) => console.log(exo.generator(10)));
console.log('erger');
export { exercises };
