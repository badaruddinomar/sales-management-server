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
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.route';
import categoryRoutes from './routes/category.routes';
import unitRoutes from './routes/unit.routes';
import saleRoutes from './routes/sale.routes';
import statsRoutes from './routes/stats.routes';
import fileUpload from 'express-fileupload';

const app: Application = express();

// middleware--
const corsOptions = {
  origin: config.client_url,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  // optionsSuccessStatus: 204,
  optionsSuccessStatus: 200,
  allowedHeaders: 'Content-Type,Authorization',
};
app.use(express.json());
app.use(cors(corsOptions));
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
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/units', unitRoutes);
app.use('/api/v1/sales', saleRoutes);
app.use('/api/v1/stats', statsRoutes);
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
