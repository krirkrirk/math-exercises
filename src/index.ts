import { exercises } from './exercises/exercises';

const allExercises = [...exercises];

// allExercises.forEach((exo) => {
//   console.log(exo);
//   console.log(exo.generator(10));
// });
if (process.env.MODE === 'dev') import('./server');

export { allExercises };
