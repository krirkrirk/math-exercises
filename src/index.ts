import { exercises } from './exercises/exercises';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const allExercises = [...exercises];

// allExercises.forEach((exo) => {
//   console.log(exo);
//   console.log(exo.generator(10));
// });

dotenv.config();

const app: Express = express();

// const corsOptions = {
//   origin: ['127.0.0.1:5173/'],
//   credentials: false,
// };

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

app.listen('5000', () => {
  console.log(`[server]: Server is running at http://localhost:5000`);
});

export { allExercises };
