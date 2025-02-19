import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "secret";

export const generateAccessToken = (
    uid: string,
    email: string,
    expiresIn: "1h"
) => {
    return jwt.sign({ uid, email }, secret, { 
        expiresIn,
    });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, secret) as jwt.JwtPayload;
};