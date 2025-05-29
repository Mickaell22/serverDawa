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

    // Verificar que la cédula tenga 10 caracteres
    if (ci.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "La cédula debe tener exactamente 10 números",
      });
    }

    const reparacionesCI = await prisma.reparacion.findMany({
      where: {
        clienteCedula: ci,
      },
    });

    if (reparacionesCI.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontraron reparaciones con la cédula: ${ci}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: reparacionesCI,
    });
  } catch (error) {
    console.error("Error al obtener las reparaciones por CI:", error);
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

    // Validar que la cédula tenga 10 dígitos
    if (!cl_cedula || cl_cedula.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "La cédula debe tener exactamente 10 números",
      });
    }

    // Verificar que no falte ningún campo obligatorio
    if (
      !cl_nombre ||
      !cl_telefono ||
      !equipo ||
      !problema ||
      !tecnicoId ||
      !ordenId
    ) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios",
      });
    }

    const tecnicoExiste = await prisma.tecnico.findUnique({
      where: { id: tecnicoId },
    });
    if (!tecnicoExiste) {
      return res.status(404).json({
        success: false,
        message: "Técnico no encontrado",
      });
    }

    const ordenExiste = await prisma.orden.findUnique({
      where: { id_order: ordenId },
    });
    if (!ordenExiste) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada",
      });
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
      message: "Reparación creada correctamente",
      data: rep,
    });
  } catch (error) {
    console.error("Error al crear la reparación:", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};

export const eliminarReparacion = async (req, res) => {
  const { id } = req.params;
  try {
    const reparacion = await prisma.reparacion.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true, data: reparacion });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar reparación' });
  }
};


export const actualizarEstadoReparacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    console.log("Estado recibido:", estado);

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

    const ESTADOS_VALIDOS = ["EN_PROCESO", "ESPERANDO_REPUESTO", "TERMINADO", "ENTREGADO"];
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
