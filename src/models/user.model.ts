import { execute, escape } from "../utils/dbMain"
import { IDbUser } from "../interfaces/user.interfaces"

const userModel = {
    findOne: async (params: IDbUser) => {
        let query = `SELECT * FROM users WHERE code = ${escape(params.code)}`
        if (params.email)
            query = `SELECT * FROM users WHERE email = ${escape(params.email)} and active`
        if (params.id)
            query = `SELECT * FROM users WHERE id = ${escape(params.id)} and active`
        return execute<IDbUser>(query, [], true)
    },
    update: async (params: any) => {
        let query = `INSERT INTO users SET ?`
        if (params.id)
            query = `UPDATE users SET ? WHERE id = ${escape(params.id)}`
        delete params.id
        return execute(query, params, true)
    }
}

export default userModel;