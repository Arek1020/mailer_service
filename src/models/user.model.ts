import { execute, escape } from "../utils/dbMain"
import { IDbUser } from "../interfaces/user.interfaces"

const userModel = {
    findOne: async (userCode: string | undefined) => {
        let query = `SELECT * FROM users WHERE code = ${escape(userCode)}`
        return execute<IDbUser>(query, [], true)
    }
}

export default userModel;