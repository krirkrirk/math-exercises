import { exercises } from './exercises/exercises';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { IntervalConstructor } from './math/sets/intervals/intervals';

const allExercises = [...exercises];

const runServer = () => {
  dotenv.config();
  const app: Express = express();
  app.use(cors());

  app.get('/', (req: Request, res: Response) => {
    res.json(allExercises);
  });

  app.get('/exo', (req: Request, res: Response) => {
    const exoId = req.query.exoId;
    const exoIndex = allExercises.findIndex((exo) => exo.id == exoId);
    const exo = allExercises[exoIndex];
    if (!exo) res.send('Exo not found');
    const questions = exo?.generator(10);
    res.json({
      exercise: exo,
      questions,
      nextId: allExercises[(exoIndex + 1) % allExercises.length].id,
      prevId: allExercises[(exoIndex - 1 + allExercises.length) % allExercises.length].id,
    });
  });

  app.get('/qcmExo', (req: Request, res: Response) => {
    const exoId = req.query.exoId;
    const exoIndex = allExercises.findIndex((exo) => exo.id == exoId);
    const exo = allExercises[exoIndex];

    if (!exo) res.send('Exo not found');
    const questions = exo?.generator(10);
    const populatedQuestions = questions?.map((q) => {
      return { ...q, propositions: q.getPropositions?.(4) };
    });
    res.json({
      exercise: exo,
      questions: populatedQuestions,

      nextId: allExercises[(exoIndex + 1) % allExercises.length].id,
      prevId: allExercises[(exoIndex - 1 + allExercises.length) % allExercises.length].id,
    });
  });

  app.listen('5000', () => {
    console.log(`[server]: Server is running at http://localhost:5000`);
  });
};

runServer();
