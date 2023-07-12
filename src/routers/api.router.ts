import { NextFunction, Request, Response, Router } from "express";
import { requireSecret } from "../controllers/middleware";
import mailController from "../controllers/mail.controller";
// import accountVerifier from "@/controllers/accountVerifier";
import { verifyAccount } from "../utils/mailer";
import accountController from "../controllers/account.controller";
import userController from "../controllers/user.controller";


const router = Router();


router.post('/authorize', async (req: Request, res: Response, next: NextFunction) => {
    let result = await userController.authorize(req.body.userCode)
    return res.send(result)
})

router.post('/send', requireSecret, async (req: Request, res: Response, next: NextFunction) => {
    let result = await mailController.send(req.body, res.locals.settings)
    return res.send(result)
})

router.post('/account/verify', requireSecret, async (req: Request, res: Response, next: NextFunction) => {
    let result = await verifyAccount(req.body)
    return res.send(result)
})



export default router;