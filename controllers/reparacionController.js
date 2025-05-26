import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTodasRepaciones = async (req, res) => {
  try {
    const reparaciones = await prisma.reparacion.findMany();

    return res.status(200).json({
      success: true,
      message: reparaciones.length
        ? "Reparaciones obtenidas correctamente"
        : "No existen datos de reparaciones",
      data: reparaciones,
    });
  } catch (error) {
    console.error("Error al obtener todas las reparaciones: ", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

export const getRepacionesPorCI = async (req, res) => {
  try {
    const { ci } = req.params;
    console.log(ci);

    const reparacionesCI = await prisma.reparacion.findMany({
      where: {
        clienteCedula: parseInt(ci),
      },
    });

    if (reparacionesCI.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontraron coincidencias con su búsqueda por el número de cédula: ${ci}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: reparacionesCI,
    });
  } catch (error) {
    console.error("Error al obtener las repaciones: ", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

export const getRepacionesPorEmpleadoId = async (req, res) => {
  try {
    const { id_empleado } = req.params;
    console.log(id_empleado);

    const reparacionesEmp = await prisma.reparacion.findMany({
      where: {
        tecnicoId: parseInt(id_empleado),
      },
    });

    if (reparacionesEmp.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontraron coincidencias con su búsqueda por el id del empleado: ${id_empleado}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: reparacionesEmp,
    });
  } catch (error) {
    console.error("Error al obtener las repaciones: ", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

export const getReparacionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const reparacion = await prisma.reparacion.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!reparacion) {
      return res.status(404).json({
        success: false,
        message: "Reparacion no encontrada",
      });
    }

    return res.status(200).json({
      success: true,
      data: reparacion,
    });
  } catch (error) {
    console.error("Error al obtener la reparacion: ", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

export const crearReparacion = async (req, res) => {
  try {
    //estado es automatico al inicio
    const {
      cl_nombre,
      cl_cedula,
      cl_telefono,
      equipo,
      problema,
      tecnicoId,
      fechaEntregaEst,
      ordenId,
    } = req.body;

    if (
      !cl_nombre ||
      !cl_cedula ||
      !cl_telefono ||
      !equipo ||
      !problema ||
      !tecnicoId ||
      !ordenId
    ) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos obligatorios",
      });
    }

    const tecnicoExiste = await prisma.tecnico.findUnique({
      where: { id: tecnicoId },
    });
    if (!tecnicoExiste) {
      return res
        .status(404)
        .json({ success: false, message: "Técnico no encontrado" });
    }

    const ordenExiste = await prisma.orden.findUnique({
      where: { id_order: ordenId },
    });
    if (!ordenExiste) {
      return res
        .status(404)
        .json({ success: false, message: "Orden no encontrada" });
    }

    const rep = await prisma.reparacion.create({
      data: {
        fechaIngreso: new Date(),
        clienteNombre: cl_nombre,
        clienteCedula: cl_cedula,
        clienteTelefono: cl_telefono,
        equipo: equipo,
        problemaReportado: problema,
        tecnicoId: tecnicoId,
        fechaEntregaEstimada: fechaEntregaEst
          ? new Date(fechaEntregaEst)
          : undefined,
        ordenId: ordenId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Reparacion creada correctamente",
      data: rep,
    });
  } catch (error) {
    console.error("Error al crear la reparacion: ", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

export const actualizarEstadoReparacion = async (req, res) => {
  try {
    const { id, estado } = req.params;

    const reparacionExistente = await prisma.reparacion.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!reparacionExistente) {
      return res.status(404).json({
        success: false,
        message: "Reparacion no encontrada",
      });
    }

    if (reparacionExistente.estado === "TERMINADO") {
      return res.status(400).json({
        success: false,
        message: "Esta reparacion ya ha sido terminada",
      });
    }

    const ESTADOS_VALIDOS = ["EN_PROCESO", "TERMINADO", "CANCELADO"];
    if (!ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: "Estado inválido",
      });
    }

    if (estado === "TERMINADO") {
      await prisma.reparacion.update({
        where: { id: parseInt(id) },
        data: { estado: estado, fechaEntregaReal: new Date() },
      });
    } else {
      await prisma.reparacion.update({
        where: { id: parseInt(id) },
        data: { estado: estado },
      });
    }

    return res.status(200).json({
      success: true,
      message: `La reparación ha sido actualizada al estado: ${estado}`,
    });
  } catch (error) {
    console.error("Error al cambiar el estado:", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};
