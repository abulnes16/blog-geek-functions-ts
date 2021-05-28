/* Blog Geek API Express */

import * as express from 'express';
import * as cors from 'cors';
import { sendWeeklyPosts } from './controllers';
import errorHandler from './module/errorHandler';

const app = express();

app.use(cors());

app.post('/v1', sendWeeklyPosts);

app.use(errorHandler);

export default app;