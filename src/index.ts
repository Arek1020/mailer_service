import express, { Request, Response } from 'express';
import Logger from './library/Logger';
import apiRouter from './routers/api.router'
import userRouter from './routers/user.router'
import mailRouter from './routers/mail.router'
import config from './config';
import * as DbMainConnector from './utils/dbMain'
import * as autosender from './controllers/autosender'
import scheduler from 'node-schedule'
import { isAuthorize } from './controllers/middleware';

const cors = require('cors')

const app = express();

app.use(cors())

app.use(express.json());

// initialize mysql pool
DbMainConnector.init();

app.get('/status', (req: Request, res: Response) => {
  res.send("Status: WORKING :)");
});

app.use(['/user'], userRouter)
app.use(['/mail'], isAuthorize, mailRouter)
app.use(['/api'], apiRouter)

scheduler.scheduleJob("*/15 * * * *", autosender.start)

app.listen(config.PORT, () => {
  Logger.success('Server is listening on port ' + config.PORT);
});
