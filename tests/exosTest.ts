import { Exercise } from "../src/exercises/exercise";
import { exoTest } from "./exoTest";

type Worst = {
  exoId: string;
  time: number;
};

export const exosTest = (exos: Exercise[]) => {
  const questionsGenerationTimes: number[] = [];
  let worstQuestionGenerationTime: Worst = { exoId: "", time: 0 };
  const qcmGenerationTimes: number[] = [];
  let worstQCMGenerationTime: Worst = { exoId: "", time: 0 };
  const veaTimes: number[] = [];
  let worstVEATime: Worst = { exoId: "", time: 0 };
  const ggbVeaTimes: number[] = [];
  let worstGGBVEATime: Worst = { exoId: "", time: 0 };
  // const allExos = [MathExercises.inflexionPointQuadrinomials];
  exos.forEach((exo) => {
    console.log(exo.id);
    try {
      const times = exoTest(exo);
      veaTimes.push(times.veaTime);
      questionsGenerationTimes.push(times.generatorTime);
      qcmGenerationTimes.push(times.qcmTime);

      if (times.veaTime > worstVEATime.time)
        worstVEATime = { exoId: exo.id, time: times.veaTime };
      if (times.generatorTime > worstQuestionGenerationTime.time)
        worstQuestionGenerationTime = {
          exoId: exo.id,
          time: times.generatorTime,
        };
      if (times.qcmTime > worstQCMGenerationTime.time)
        worstQCMGenerationTime = { exoId: exo.id, time: times.qcmTime };
    } catch (err) {
      console.log(exo.id, err);
      throw err;
    }
  });
  console.log(
    "average ggbVea",
    ggbVeaTimes.reduce((acc, curr) => acc + curr, 0) / ggbVeaTimes.length,
  );
  console.log(
    "average vea",
    veaTimes.reduce((acc, curr) => acc + curr, 0) / veaTimes.length,
  );
  console.log(
    "average qcm",
    qcmGenerationTimes.reduce((acc, curr) => acc + curr, 0) /
      qcmGenerationTimes.length,
  );
  console.log(
    "average generator",
    questionsGenerationTimes.reduce((acc, curr) => acc + curr, 0) /
      questionsGenerationTimes.length,
  );
  console.log("worst qcm", worstQCMGenerationTime);
  console.log("worst vea", worstVEATime);
  console.log("worst ggbVea", worstGGBVEATime);
  console.log("worst generator", worstQuestionGenerationTime);
};
