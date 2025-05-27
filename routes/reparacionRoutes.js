import { Router } from "express";
import {actualizarEstadoReparacion, crearReparacion, getRepacionesPorCI, getRepacionesPorEmpleadoId, getReparacionPorId, getTodasRepaciones} from "../controllers/reparacionController.js";

//inicio el router
const repacionesRoutes = new Router();

repacionesRoutes.get("/reparaciones", getTodasRepaciones);
repacionesRoutes.get("/reparaciones/cliente/:ci", getRepacionesPorCI);
repacionesRoutes.get("/reparaciones/empleado/:id_empleado", getRepacionesPorEmpleadoId);
repacionesRoutes.get("/reparaciones/:id", getReparacionPorId);
repacionesRoutes.post("/reparaciones/crear", crearReparacion);
repacionesRoutes.put("/reparaciones/actualizar/:id", actualizarEstadoReparacion);

export default repacionesRoutes;