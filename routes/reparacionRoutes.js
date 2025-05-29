import { Router } from "express";
import {actualizarEstadoReparacion, crearReparacion, getRepacionesPorCI, getRepacionesPorEmpleadoId, getReparacionPorId, getTodasRepaciones, eliminarReparacion} from "../controllers/reparacionController.js";

//inicio el router
const repacionesRoutes = new Router();
//Definimos las rutas de reparaciones
repacionesRoutes.get("/reparaciones", getTodasRepaciones);
repacionesRoutes.get("/reparaciones/cliente/:ci", getRepacionesPorCI);
repacionesRoutes.get("/reparaciones/empleado/:id_empleado", getRepacionesPorEmpleadoId);
repacionesRoutes.get("/reparaciones/:id", getReparacionPorId);
repacionesRoutes.post("/reparaciones/crear", crearReparacion);
repacionesRoutes.put("/reparaciones/actualizar/:id", actualizarEstadoReparacion);
repacionesRoutes.delete('/reparaciones/:id', eliminarReparacion);



export default repacionesRoutes;