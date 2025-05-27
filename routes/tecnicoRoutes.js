import { Router } from "express";
import {getTodosTecnicos, getTecnicoId, createTecnico} from "../controllers/tecnicoController.js";

//inicio el router
const tecnicosRoutes = new Router();

tecnicosRoutes.get("/tecnicos/listar", getTodosTecnicos);
tecnicosRoutes.get("/tecnicos/:id", getTecnicoId);
tecnicosRoutes.post('/tecnicos', createTecnico);


export default tecnicosRoutes;