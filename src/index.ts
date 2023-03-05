import { exercises } from './exercises/exercises';

const allExercises = [...exercises];
exercises.forEach((exo) => console.log(exo.generator(10)));
console.log('erge');
export { allExercises };
