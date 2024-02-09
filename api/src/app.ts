import express, { Request, Response } from 'express';
import apiRouter from './routers/api.router'
import userRouter from './routers/user.router'
import mailRouter from './routers/mail.router'
import * as DbMainConnector from './utils/dbMain'

import { isAuthorize } from './controllers/middleware';
import dotenv from "dotenv"
dotenv.config()

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

app.use(express.static(__dirname + "/view"));

app.post('/status', (req: Request, res: Response) => {
    res.send({ message: "It works!" });
});

app.use(['/user'], userRouter)
app.use(['/mail'], isAuthorize, mailRouter)
app.use(['/api'], apiRouter)

export default app;