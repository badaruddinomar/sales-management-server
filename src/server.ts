import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import config from './config';
import notFound from './middleware/notFound';
import globalErrorHandler from './middleware/globarErrorHandler';
import authRoutes from './routes/auth.routes';
import fileUpload from 'express-fileupload';

const app: Application = express();

// middleware--
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

// handling uncaught exceptions--
process.on('uncaughtException', (err) => {
  console.log(`error: ${err.message}`);
  console.log(`Uncaught exception: ${err.stack}`);
  process.exit(1);
});

// mongodb connection--
mongoose
  .connect(config.mongo_uri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// routes--
app.get('/', (_req, res) => {
  res.send('Hello World!');
});
app.use('/api/v1/auth', authRoutes);
// not found middleware
app.use(notFound);
app.use(globalErrorHandler);
// server--
const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

// unhandled promise rejection--
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err}`);
  console.log(`Shuting down the server due to unhandled promise rejection!`);

  server.close(() => {
    process.exit(1);
  });
});
