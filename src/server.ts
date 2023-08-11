import { exercises } from './exercises/exercises';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

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
    const exo = allExercises.find((exo) => exo.id == exoId);
    if (!exo) res.send('Exo not found');
    const questions = exo?.generator(10);
    res.json({
      exercise: exo,
      questions,
    });
  });

  app.get('/qcmExo', (req: Request, res: Response) => {
    const exoId = req.query.exoId;
    const exo = allExercises.find((exo) => exo.id == exoId);
    if (!exo) res.send('Exo not found');
    const questions = exo?.generator(10);
    console.log(questions);
    const populatedQuestions = questions?.map((q) => {
      return { ...q, propositions: q.getPropositions?.(4) };
    });
    res.json({
      exercise: exo,
      questions: populatedQuestions,
    });
  });

  app.listen('5000', () => {
    console.log(`[server]: Server is running at http://localhost:5000`);
  });
};

runServer();
