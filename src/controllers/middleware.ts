import { NextFunction, Request, Response } from "express";
import config from './../config'
import accountController from "./account.controller";
import userModel from "../models/user.model";
import { IDbUser } from "../interfaces/user.interfaces";
import { verify } from "jsonwebtoken";
import Logger from "../library/Logger";



export const requireSecret = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");
    if (!authHeader)
        return res.sendStatus(403)

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = verify(token, config.SECRETKEY);
    } catch (err) {
        Logger.error(err)
        return res.status(403).json({ err: true, message: 'Brak autoryzacji - nieprawidłowy token' });
    };
    if (!decodedToken)
        return res.status(403).json({ err: true, message: 'Brak autoryzacji - nieprawidłowy token' });

    console.log('tttt', decodedToken)

    let user = decodedToken
    res.locals.user = user;

    // let settings = await accountController.get(user.id, req.body.name || 'DEFAULt ACCOUNT', false)
    // res.locals.settings = settings;
    return next();
}
