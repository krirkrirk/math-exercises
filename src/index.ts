import { factoIdRmq1 } from './exercises/calculLitteral/factorisation/factoIdRmq1';
import { factoIdRmq2 } from './exercises/calculLitteral/factorisation/factoIdRmq2';
import { factoIdRmq3 } from './exercises/calculLitteral/factorisation/factoIdRmq3';
import { exercises } from './exercises/exercises';

const allExercises = [...exercises];

allExercises.forEach((exo) => {
  console.log(exo);
  console.log(exo.generator(10));
});

export { allExercises };
