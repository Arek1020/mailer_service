import { execute, escape } from "../utils/dbMain"
import moment from "moment"
import { IDbMail } from "interfaces/mail.interfaces"
import config from '../config'

const mailModel = {
    findOne: async (opts: { status?: any, id?: string }): Promise<IDbMail> => {
        let query = `SELECT m.* FROM mails m`
        if (opts.status)
            query += ` WHERE m.status = ${escape(opts.status)}`
        if (opts.id)
            query += ` WHERE m.id = ${escape(opts.id)}`
        return execute(query, [], true)
    },
    get: async (opts: { status?: any, messageId?: string }): Promise<IDbMail[]> => {
        let query = `SELECT m.* FROM mails m`
        if (opts.status)
            query += ` WHERE m.status = ${escape(opts.status)}`
        if (opts.messageId)
            query += ` WHERE m.message_id = ${escape(opts.messageId)}`
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
        let query = 'INSERT INTO mails (company, active, sid, contractor, member, user, email, `desc`, subject, message_id, status, date, module, element, attachments, password, publicKey, privateKey) VALUES ?'
        return execute(query, payload, false)
    }
}

export default mailModel;