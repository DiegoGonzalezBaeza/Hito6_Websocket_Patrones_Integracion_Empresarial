import { NextFunction, Request, Response } from "express";
import { userService } from "../services/user.service";

const getUsers = async (req: Request, res: Response, next: NextFunction) => { 
  try { 
    const users = await userService.getAllUsers(); 
    res.json({ 
      email: req.email, 
      users, 
    });
    }catch (error) {
        next(error);
    }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { uid } = req.params;
        const user = await userService.getUseById(uid);
    if (!user) {
        res.status(404).json({ message: "User not found" });
    } else {
        res.json(user);
    }
    }catch (error) {
        next(error);
    }
};


const createUser = async(req: Request, res: Response) => {
    try{
        const {email, password} = req.body;
        const newUser = await userService.createUserWithEmailAndPassword(email, password);
        res.json({ newUser });
    }catch (error) {
        console.log(error);
        if (error instanceof Error) {
        res.status(500).json({error: error.message});
        } else res.status(500).json({error: "Error del servidor"});;
    }
};

const deleteUser = async(req: Request, res: Response) => {
    try{
        const { uid } = req.params;
        const user = await userService.deleteUserById(uid);
        res.json(user);
    }catch (error) {
        console.log(error);
        if (error instanceof Error) {
        res.status(500).json({error: error.message});
        } else res.status(500).json({error: "Error del servidor"});;
    }
};

const updateUser = async(req: Request, res: Response) => {
    try{
        const { uid } = req.params;
        const { email, password } = req.body;
        const user = await userService.updateUserById(uid, email, password);
        res.json(user);
    }catch (error) {
        console.log(error);
        if (error instanceof Error) {
        res.status(500).json({error: error.message});
        } else res.status(500).json({error: "Error del servidor"});;
    }
};

export const userController = {
    getUsers,
    createUser,
    getUser,
    deleteUser,
    updateUser,
}