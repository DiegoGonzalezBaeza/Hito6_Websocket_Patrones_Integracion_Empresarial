import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userService } from "./user.service";
import { generateAccessToken } from "../utils/auth.util";
import { HttpError } from "../utils/httpError.util";
import logger from "../utils/logger.util";


const loginWithEmailAndPassword = async(email: string, password: string) => {
    const user = await userService.getUserByEmail(email);
    console.log(password);
    if(!user) {
        // para saber si el error es por el email
        logger.error(email);

        throw new HttpError("User not found", 400);
    }

    if (!password) {
        throw new HttpError("Password ingresado is undefined "+{password}, 401);
      }

    if (!user.password) {
        throw new HttpError("Password en BD is undefined "+{password}, 401);
      }

    // 2. comparar los hash de contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new HttpError("Password incorrect", 400); 
    }
    const wordSecret = process.env.JWT_SECRET;
    if (!wordSecret) {
        throw new Error("La variable de entorno wordSecret no está definida.");
      }
    // 3. Generar el Token
    const token = jwt.sign({email: user.email}, wordSecret, {
        expiresIn: "1h"
    });

    return token ;
};

const registerUserWithEmailAndPassword = async(email: string, password: string) => {
    const newUser = await userService.createUserWithEmailAndPassword(email, password);

    const token = generateAccessToken(newUser.uid, newUser.email, "1h");

    return token;
};


export const authService = {
    loginWithEmailAndPassword,
    registerUserWithEmailAndPassword,
};