import Router from "express";
import {getTodasRepaciones} from "../controllers/reparacionController.js";

//inicio el router
const repacionesRoutes = new Router();

repacionesRoutes.get("/reparaciones", getTodasRepaciones);
repacionesRoutes.get("/reparaciones/:order_id", );
repacionesRoutes.post("/reparaciones/crear", );
repacionesRoutes.put("/reparaciones/actualizar/:order_id", );

export default repacionesRoutes;