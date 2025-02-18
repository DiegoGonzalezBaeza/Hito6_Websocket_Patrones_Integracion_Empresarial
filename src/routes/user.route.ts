import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/jwt.middleware";

const router: Router = Router();

// Ruta para hacer la petición
// path: http://localhost:3000/api/v1/users

// Leer los usuarios
router.get('/', verifyToken, userController.getUsers);

// leer un único usuario por id
router.get('/:uid', userController.getUser);


//  crear un nuevo usuario (REGISTER)
//  path: http://localhost:3000/api/v1/auth/register

router.post('/', userController.createUser);

// router.delete("/:uid",verifyToken, verifyAdminRole, userController.deleteUser); 

router.delete("/:uid", verifyToken, userController.deleteUser); 

router.put("/:uid", userController.updateUser);

export default router;