import { NextFunction, Request, Response } from "express";
import config from './../config'
import accountController from "./account.controller";
import userModel from "../models/user.model";
import { IDbUser } from "../interfaces/user.interfaces";
import { verify } from "jsonwebtoken";
import Logger from "../library/Logger";
import * as JWT from "jsonwebtoken";



export const requireSecret = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");
    if (!authHeader)
        return res.sendStatus(403)

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        // decodedToken = verify(token, config.SECRETKEY);
        decodedToken = token == config.SECRETKEY;
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

export const isAuthorize = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.get("Authorization");
    console.log('aaa', authHeader)

    if (!authHeader) {
        return res.status(401).json({ message: 'not authenticated' });
    };
    const token = authHeader.split(' ')[1];

    if (!token || token == 'null' || token == null) {
        return res.status(401).json({ message: 'not authenticated' });
    };

    let decodedToken: any;
    try {
        decodedToken = JWT.verify(token, config.SECRETKEY);
    } catch (err) {
        Logger.log(err)
        return res.status(500).json({ err: true, message: 'Brak autoryzacji - nieprawidłowy token' });
    };

    if (!decodedToken?.id) {
        res.status(403).json({ message: 'forbidden' });
    } else {
        let user = await userModel.findOne({ id: decodedToken.id })
        if (!user)
            return res.status(403).json({ message: 'forbidden' });
        console.log('dddd', user, decodedToken)

        res.locals.user = user
        return next();

    };
}
