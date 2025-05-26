import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const calcularPrecioTotal = (precio, cantidad) => {
  return parseFloat(precio * cantidad);
};

// todos las ordenes
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.orden.findMany();

    if (orders.length <= 0) {
      return res.status(200).json({
        success: false,
        message: "No existen datos de facturas",
        data: orders,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "ordenes obtenidos correctamente",
        data: orders,
      });
    }
  } catch (error) {
    console.error("Error al obtener todas las ordenes: ", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};
// todos las ordenes aprobadas
export const getAllOrdersByStateTrue = async (req, res) => {
  try {
    const orders = await prisma.orden.findMany({
      where: {
        aprobado: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "ordenes obtenidos correctamente",
      data: orders,
    });
  } catch (error) {
    console.error("Error al obtener las ordenes aprobadas: ", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};
// todos las ordenes no aprobadas
export const getAllOrdersByStateFalse = async (req, res) => {
  try {
    const orders = await prisma.orden.findMany({
      where: {
        aprobado: false,
      },
    });

    return res.status(200).json({
      success: true,
      message: "ordenes obtenidos correctamente",
      data: orders,
    });
  } catch (error) {
    console.error("Error al obtener las ordenes no aprobadas: ", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};
//orden por id
export const getOrderById = async (req, res) => {
  try {
    const { order_id } = req.params;
    console.log(order_id);

    const orden = await prisma.orden.findUnique({
      where: {
        id_order: parseInt(order_id),
      },
    });

    if (!orden) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada",
      });
    }

    const detallesOrden = await prisma.productoOrden.findMany({
      where: {
        ordenId: orden.id_order,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        orden,
        detalles: detallesOrden,
      },
    });
  } catch (error) {
    console.error("Error al obtener la orden: ", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};
// nueva orden
export const createOrder = async (req, res) => {
  //nota: usar promesa para cuando se quiera buscar un id de factura y luego traer sus detalles
  try {
    //total debe ser calculado
    const {
      cl_nombre,
      cl_apellido,
      cl_cedula,
      cl_telefono,
      cl_ubicacion,
      productos,
    } = req.body;

    if (
      !cl_nombre ||
      !cl_apellido ||
      !cl_cedula ||
      !cl_telefono ||
      !cl_ubicacion
    ) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos obligatorios",
      });
    }

    if (!productos || productos.length <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "No tienes ningun producto o servicio seleccionado en la factura",
      });
    }

    let totalCalculado = 0;

    // Calcular el total antes de crear la orden
    for (const prd of productos) {
      const product = await prisma.repuesto.findUnique({
        where: { id: parseInt(prd.repuestoId) },
      });

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Producto con ID ${prd.repuestoId} no encontrado.`,
        });
      }

      if (prd.cantidad > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para el producto "${product.nombre}". Disponible: ${product.stock}, solicitado: ${prd.cantidad}`,
        });
      }

      totalCalculado += calcularPrecioTotal(product.precio, prd.cantidad);
    }

    const newOrder = await prisma.orden.create({
      data: {
        emitida: new Date(),
        total: totalCalculado,
        aprobado: false,
        cl_nombre,
        cl_apellido,
        cl_cedula,
        cl_telefono,
        cl_ubicacion,
      },
    });

    for (const prd of productos) {
      const product = await prisma.repuesto.findUnique({
        where: { id: parseInt(prd.repuestoId) },
      });
      await prisma.productoOrden.create({
        data: {
          ordenId: newOrder.id_order,
          repuestoId: prd.repuestoId,
          precioUnitario: product.precio,
          nombreProducto: product.nombre,
          cantidad: prd.cantidad,
          montoTotal: calcularPrecioTotal(product.precio, prd.cantidad),
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: "Orden creada correctamente",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error al crear la orden: ", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};
// Cambiar estado de la orden (video 1:39)
export const changeStateOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    // Verificar si la orden existe
    const existingOrder = await prisma.orden.findUnique({
      where: {
        id_order: parseInt(order_id),
      },
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada",
      });
    }

    // Verificar que no esté ya aprobada
    if (existingOrder.aprobado) {
      return res.status(400).json({
        success: false,
        message: "Esta orden ya ha sido aprobada",
      });
    }

    const detalles = await prisma.productoOrden.findMany({
      where: { ordenId: parseInt(order_id) },
    });

    for (const detalle of detalles) {
      const producto = await prisma.repuesto.findUnique({
        where: { id: detalle.repuestoId },
      });

      if (!producto || producto.stock < detalle.cantidad) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para el producto "${producto?.nombre}". Disponible: ${producto?.stock}, necesario: ${detalle.cantidad}`,
        });
      }
    }

    for (const detalle of detalles) {
      await prisma.repuesto.update({
        where: { id: detalle.repuestoId },
        data: {
          cantidad: {
            decrement: detalle.cantidad,
          },
        },
      });
    }

    // Aprobar orden
    await prisma.orden.update({
      where: {
        id_order: parseInt(order_id),
      },
      data: {
        aprobado: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Orden aprobada correctamente y stock actualizado",
    });
  } catch (error) {
    console.error("Error al aprobar la orden:", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};
