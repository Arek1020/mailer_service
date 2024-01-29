import { NextFunction, Request, Response, Router } from "express";
import { requireSecret } from "../controllers/middleware";
import mailController from "../controllers/mail.controller";
import { verifyAccount } from "../utils/mailer";
import userController from "../controllers/user.controller";
import multer from "multer"

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post('/send', async (req: Request, res: Response, next: NextFunction) => {
    let result = await mailController.send(req.body)
    return res.send(result)
})

router.post('/sendWithAttachments', upload.array('attachments'), async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];
    req.body.attachments = files
    req.body.receivers = JSON.parse(req.body.receivers)
    let result = await mailController.send(req.body, res.locals.user)
    return res.send(result)
})

router.post('/account/verify', async (req: Request, res: Response, next: NextFunction) => {
    let result = await verifyAccount(req.body)
    return res.send(result)
})

router.post('/decrypt', async (req: Request, res: Response, next: NextFunction) => {
    let result = await mailController.decrypt(req.body)
    return res.send(result)
})

export default router;