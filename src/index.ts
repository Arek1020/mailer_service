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
app.use('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

   next();
})

app.use(cors())

app.use(express.json());

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
