import { Router } from 'express';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  loginUser 
} from '../controllers/userController.js';

const routerUsser = new Router();

// Rutas de usuariio = Registrar, login

// Rutas de usuario
routerUsser.get('/users', getAllUsers);
routerUsser.post('/users', createUser);
routerUsser.post('/login', loginUser);

// Routas de prueba
routerUsser.put('/users/:id', updateUser);
routerUsser.delete('/users/:id', deleteUser);
routerUsser.get('/users/:id', getUserById);


export default routerUsser;