import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { routes} from './routes/index.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { errorMiddleware } from "./middlewares/error.middleware.js";


const app = express();

app.use(helmet());

app.use(morgan('dev'));

app.use(cors());

app.use(express.json({ limit: "2mb" }));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);
app.use(errorMiddleware);

export default app;