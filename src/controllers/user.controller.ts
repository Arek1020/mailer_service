import { decrypt } from "../utils/tools";
import { IDbSettings, IMailAccountSettings } from "../interfaces/account.interfaces";
import config from "../config"
import userModel from "../models/user.model";
import { sign } from "jsonwebtoken";

const accountController = {
    authorize: (userCode: string): Promise<IMailAccountSettings | Object> => {
        return new Promise(async (resolve, reject) => {
            if (!userCode)
                return resolve({ err: 'CODE NOT FOUND' })

            let dbUser = await userModel.findOne(userCode);

            if (!dbUser)
                return resolve({ err: 'USER NOT FOUND' })

            const jwtToken = sign({ dbUser }, config.SECRETKEY);

            return resolve(jwtToken)
        })
    }
}

export default accountController;