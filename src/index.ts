import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Logger from './library/Logger';
import apiRouter from './routers/api.router'
import config from './config';
import * as DbMainConnector from './utils/dbMain'
// import * as DbPushekConnector from './utils/dbPushek'
import * as autosender from './controllers/autosender'
import scheduler from 'node-schedule'
// interface User {
//   id: number;
//   name: string;
//   email: string;
// }
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const app = express();
app.use(express.json());

// initialize mysql pool
DbMainConnector.init();
// DbPushekConnector.init();

app.get('/status', (req: Request, res: Response) => {
  res.send("Status: WORKING :)");
});

app.use(['/mailer', '/'], apiRouter)

scheduler.scheduleJob("*/15 * * * *", autosender.start)

app.listen(config.PORT, () => {
  Logger.success('Server is listening on port ' + config.PORT);
});
