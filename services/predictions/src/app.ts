import process from 'process';
import express from 'express';
import morgan from 'morgan';
import routes from './routes';

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('short'));
}

app.use('/', routes);

export default app;
