import { NextFunction, Request, Response } from "express";
import userModel from "../models/user.model";
import Logger from "../library/Logger";
import * as JWT from "jsonwebtoken";

export const requireSecret = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");
    if (!authHeader)
        return res.sendStatus(403)

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = token == process.env.SECRETKEY;
    } catch (err) {
        Logger.error(err)
        return res.status(403).json({ err: true, message: 'Brak autoryzacji - nieprawidłowy token' });
    };
    if (!decodedToken)
        return res.status(403).json({ err: true, message: 'Brak autoryzacji - nieprawidłowy token' });


    let user = decodedToken
    res.locals.user = user;

    return next();
}

export const isAuthorize = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.get("Authorization");

    if (!authHeader) {
        return res.status(401).json({ message: 'not authenticated' });
    };
    const token = authHeader.split(' ')[1];

    if (!token || token == 'null' || token == null) {
        return res.status(401).json({ message: 'not authenticated' });
    };

    let decodedToken: any;
    try {
        decodedToken = JWT.verify(token, process.env.SECRETKEY || '');
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

        res.locals.user = user
        return next();

    };
}
