import {Request, Response, NextFunction} from "express";
import { verifyAccessToken } from "../utils/auth.util";
import { RoleEnum } from "../models/user.model";

declare module "express-serve-static-core" {
    interface Request {
        email?: string;
        uid?: string;
        // role?: RoleEnum;
    }
};

export const verifyToken = async(req: Request, res: Response, next: NextFunction) => {
    // console.log("Alerta, pasó por aquí")
    
    // -se usa next() si queremos que tal usuario pueda seguir
    // next();

    // -O se usar error para evitar que siga:
    // res.status(401).json({ error: "no autorizado"});

    const authHeader = req.headers.authorization; // "Bearer token..."
    if (!authHeader) {
        res.status(401).json({ error: "No Bearer Header"});
        return;
    }

    const token = authHeader.split(" ")[1]
    try {
        const payload = verifyAccessToken(token);
        req.email = payload.email;
        req.uid = payload.uid;
        // req.role = payload.role;
        console.log(payload);
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Token invalid"});
    }
};

// export const verifyAdminRole = async(req: Request, res: Response, next: NextFunction) => {
//     if (req.role !== RoleEnum.ADMIN) {
//         res.status(403).json({ error: "Access denied: Admins Only"});
//         return;
//     }
//     next();
// };