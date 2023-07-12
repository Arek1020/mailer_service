import { execute, escape } from "../utils/dbMain"
import moment from "moment"
import { IDbMail } from "interfaces/mail.interfaces"
import config from '../config'

const mailModel = {
    get: async (opts: { status: any }): Promise<IDbMail[]> => {
        let query = `SELECT m.* FROM mails m`
        if (opts.status)
            query += ` WHERE m.status = ${escape(opts.status)}`
        return execute(query, [], false)
    },
    update: async (opts: IDbMail | any) => {
        let query = `INSERT INTO mails SET ?`
        if (opts.id)
            query = `UPDATE mails SET ? WHERE id = ${escape(opts.id)}`
            delete opts.id
        return execute(query, opts, true)
    },
    insertMany: async (payload: any) => {
        let query = 'INSERT INTO mails (company, active, sid, contractor, member, user, email, `desc`, subject, message_id, status, date, module, element) VALUES ?'
        return execute(query, payload, false)
    }
}

export default mailModel;