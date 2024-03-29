import { NextFunction, Request, Response, Router } from "express";
import userController from "../controllers/user.controller";
import { isAuthorize } from "../controllers/middleware";
import { decrypt } from "../utils/cryptography";

const router = Router();

router.post('/get', isAuthorize, async (req: Request, res: Response, next: NextFunction) => {

    return res.send({
        ...res.locals.user, encrypt: '',
        privateKey: decrypt(res.locals.user.privateKey, res.locals.user.encrypt),
        publicKey: decrypt(res.locals.user.publicKey, res.locals.user.encrypt)
    })
})

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    let result = await userController.login({ email: req.body.email, password: req.body.password })
    return res.send(result)
})

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    let result = await userController.register({ email: req.body.email, password: req.body.password, repeatPassword: req.body.repeatPassword })
    return res.send(result)
})

router.post('/keys/generate', isAuthorize, async (req: Request, res: Response, next: NextFunction) => {
    let result = await userController.generateKeys({
        userID: res.locals.user.id,
        email: res.locals.user.email,
        passphrase: req.body.passphrase,
        name: res.locals.user.name || res.locals.user.email,
        encrypt: res.locals.user.encrypt
    })
    return res.send(result)
})

export default router;