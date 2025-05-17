import { Router } from 'express';
import {
    getAllRepuestos, 
    getRepuestoById,
    createRepuesto,
    updateRepuesto,
    deleteRepuesto
} from '../controllers/repuestoController.js'

const routerRepuesto = new Router();

// Rutas de repuesto = CRUD, Crear, Listar, Actualizar, Eliminar (Logico y fisco?)

// Listar todos los repuestos
routerRepuesto.get('/repuestos', getAllRepuestos);
routerRepuesto.get('/repuestos/:id', getRepuestoById);
routerRepuesto.post('/repuestos', createRepuesto);
routerRepuesto.put('/repuestos/:id', updateRepuesto);
routerRepuesto.delete('/repuestos/:id', deleteRepuesto);

export default routerRepuesto;