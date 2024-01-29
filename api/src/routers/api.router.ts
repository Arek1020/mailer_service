import { NextFunction, Request, Response, Router } from "express";
import { requireSecret } from "../controllers/middleware";
import mailController from "../controllers/mail.controller";
// import accountVerifier from "@/controllers/accountVerifier";
import { verifyAccount } from "../utils/mailer";
import accountController from "../controllers/account.controller";
import userController from "../controllers/user.controller";
import multer from "multer"

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post('/authorize', async (req: Request, res: Response, next: NextFunction) => {
    let result = await userController.authorize(req.body.userCode)
    return res.send(result)
})

router.post('/send', requireSecret, async (req: Request, res: Response, next: NextFunction) => {
    let result = await mailController.send(req.body)
    return res.send(result)
})

router.post('/sendWithAttachments', requireSecret, upload.array('attachments'), async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];
    req.body.attachments = files
    req.body.receivers = JSON.parse(req.body.receivers)
    let result = await mailController.send(req.body)
    return res.send(result)
})

router.post('/account/verify', requireSecret, async (req: Request, res: Response, next: NextFunction) => {
    let result = await verifyAccount(req.body)
    return res.send(result)
})



export default router;