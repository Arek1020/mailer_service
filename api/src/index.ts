import app from "./app";
import Logger from './library/Logger';
import * as autosender from './controllers/autosender'
import scheduler from 'node-schedule'

scheduler.scheduleJob("*/15 * * * *", autosender.start)

app.listen(process.env.PORT, () => {
  Logger.success('Server is listening on port ' + process.env.PORT);
});
