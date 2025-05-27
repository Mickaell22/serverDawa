import { Router } from "express";
import {
  getAllOrders,
  getAllOrdersByStateFalse,
  getAllOrdersByStateTrue,
  getOrderById,
  createOrder,
  changeStateOrder
} from "../controllers/orderController.js";

//inicio el router
const routes_orders = new Router();
//agrego mis rutas
routes_orders.get("/facturas", getAllOrders);
routes_orders.get("/facturas/aprobadas", getAllOrdersByStateTrue);
routes_orders.get("/facturas/default", getAllOrdersByStateFalse);
routes_orders.get("/facturas/:order_id", getOrderById);
routes_orders.post("/facturas/crear", createOrder);
routes_orders.put("/facturas/aprobar/:order_id", changeStateOrder);

export default routes_orders;
