import { IMailAccountSettings } from "../interfaces/account.interfaces";
import userModel from "../models/user.model";
import { sign } from "jsonwebtoken";
import * as bcrypt from 'bcrypt'
import * as JWT from "jsonwebtoken";
import * as emailValidator from 'email-validator'
import passwordValidator from 'password-validator';
import { decrypt, encrypt, generateKeyPair } from "../utils/cryptography";
import * as generator from "generate-password"

const userController = {
    authorize: (userCode: string): Promise<IMailAccountSettings | Object> => {
        return new Promise(async (resolve, reject) => {
            if (!userCode)
                return resolve({ err: 'CODE NOT FOUND' })

            let dbUser = await userModel.findOne({ code: userCode });

            if (!dbUser)
                return resolve({ err: 'USER NOT FOUND' })

            const jwtToken = sign({ dbUser }, process.env.SECRETKEY || '');

            return resolve(jwtToken)
        })
    },
    login: async (opts: { email: string, password: string }) => {
        if (!opts.email)
            return { message: 'Brak adresu e-mail' }
        if (!opts.password)
            return { message: 'Brak hasła' }

        opts.email = opts.email.trim();
        let dbUser = await userModel.findOne({ email: opts.email })
        if (!dbUser?.email) {
            return { message: "Nie znaleziono takiego użytkownika" }
        } else {
            const compareRes = await bcrypt.compare(opts.password, dbUser.password || '')
            if (compareRes) { // password match
                // const token = jwt.sign({ email: opts.email, id: dbUser?.id }, process.env.SECRET, { expiresIn: process.env.TOKEN_EXPIRATION + ' days' });
                const token = JWT.sign({ email: opts.email, id: dbUser?.id }, process.env.SECRETKEY || '');
                delete dbUser.password;
                return { message: "Zalogowano pomyślnie", "token": token, user: JSON.stringify(dbUser) }
            } else { // password doesnt match
                return { message: "Nieprawidłowe dane logowania" }
            };
        };
    },
    register: async (opts: { password: string; repeatPassword: string; email: string; }) => {
        var passwordValidationResult = validatePassword(opts.password)

        if (!opts.email || !emailValidator.validate(opts.email))
            return { err: true, message: 'Nieprawidłowy adres e-mail' }
        if (opts.password !== opts.repeatPassword)
            return { err: true, message: 'Podane hasła są różne' }
        if (!opts.password || passwordValidationResult.err)
            return passwordValidationResult


        opts.email = opts.email.trim();

        let dbUser = await userModel.findOne({ email: opts.email })
        if (dbUser?.email) {
            return { err: true, message: "Konto z takim adresem e-mail juz istnieje" }
        } else if (opts.email && opts.password) {
            let passwordHash = await bcrypt.hash(opts.password, 12)
            let encrypt = generator.generate({
                length: 10,
                numbers: true
            });

            if (passwordHash) {
                let userData = {
                    email: opts.email,
                    password: passwordHash,
                    encrypt
                }
                let result = await userModel.update(userData)
                return { message: "Pomyślnie utworzono użytkownika. Aby aktywować konto kliknij w link wysłany na podanego maila." }

            };
        };
    },
    generateKeys: async (params: { passphrase: string, name: string, email: string, userID: number, encrypt: string }) => {
        const { privateKey, publicKey } = await generateKeyPair(params.name, params.email, params.passphrase)

        await userModel.update({
            id: params.userID,
            email: params.email,
            privateKey: encrypt(privateKey, params.encrypt),
            publicKey: encrypt(publicKey, params.encrypt),
            passphrase: encrypt(params.passphrase, params.encrypt)
        })

        return { privateKey, publicKey }
    }
}

const passwordSchema = new passwordValidator();
const validatePassword = (password: string) => {
    passwordSchema
        .is().min(8)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        // .has().digits(2)                                // Must have at least 2 digits
        .has().not().spaces()                           // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123']);

    let result: any = passwordSchema.validate(password)
    if (!result)
        result = { err: true, message: 'Hasło powinno zawierać minimum 8 znaków, duże i małe litery.' }
    return result
}

export default userController;