import { User } from "../models/user.model";
// import {nanoid} from "nanoid";
// import { User } from "../interfaces/user.interface";
import bcrypt from "bcryptjs";
import { HttpError } from "../utils/httpError.util";

const getAllUsers = async () => {
    const users = await User.findAll();
    return users;
};

const getUseById = async (uid: string) => { 
    const user = await User.findByPk(uid); 
    if (!user) throw new HttpError("User not found", 400); 
    return user; 
  }; 

const getUserByEmail = async (email: string) => { 
    const user = await User.findOne({ where :{ email }}); 
    if (!user) throw new HttpError("User not found", 400); 
    return user; 
  };

const createUserWithEmailAndPassword = async(email: string, password: string) => {
    const user = await User.findOne({ where :{ email }});
    if (user){
        throw new HttpError("Email already exists", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    const newUser = await User.create({ email, password: passwordHashed });
    return newUser;
};

const deleteUserById = async (uid: string) => { 
    const user = await User.findByPk(uid); 
    if (!user) throw new HttpError("User not found", 400); 
    await user.destroy(); // Usa destroy para eliminar el usuario
    return { message: "User deleted successfully" }; 
  };

  const updateUserById = async (uid: string, email?: string, password?: string) => {
    const user = await User.findByPk(uid);
    if (!user) throw new HttpError("User not found", 400);
  
    // Actualiza solo los campos proporcionados
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
  
    await user.save(); // Guarda los cambios
    return user;
  };

export const userService = {
    getAllUsers,
    getUseById,
    getUserByEmail,
    deleteUserById,
    updateUserById,
    createUserWithEmailAndPassword,
}