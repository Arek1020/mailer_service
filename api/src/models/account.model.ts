import { execute, escape } from "../utils/dbMain"
import { IDbSettings } from "../interfaces/account.interfaces"

const accountModel = {
    get: async (user: number) => {
        let query = `SELECT u.*, u.encrypt  FROM settings s
        INNER JOIN users u ON u.id = s.user
        WHERE u.name like 'KONTO_EMAIL'
        AND s.user = ${escape(user)}`
        return execute<IDbSettings[]>(query, [], false)
    }
}

export default accountModel;