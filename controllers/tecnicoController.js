import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTodosTecnicos = async(req, res) =>{
  try {
    const tecnicos = await prisma.tecnico.findMany();

    return res.status(200).json({
      success: true,
      message: tecnicos.length
        ? "Todos los tenicos han sido obtenidos correctamente"
        : "No existen datos de tecnicos",
      data: tecnicos,
    });
  } catch (error) {
    console.error("Error al obtener todas los tecnicos: ", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
}

export const getTecnicoId = async(req, res) =>{
    try {
    const { id } = req.params;
    console.log(id);

    const tecnico = await prisma.tecnico.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!tecnico) {
      return res.status(404).json({
        success: false,
        message: "Tecnico no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      data: tecnico,
    });
  } catch (error) {
    console.error("Error al obtener el tecnico: ", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
}

export const createTecnico = async (req, res) => {
  try {
    const { nombre, cedula, telefono, especialidad, estado } = req.body;

    // Validación básica de campos obligatorios
    if (!nombre || !cedula || !telefono || !estado) {
      return res.status(400).json({
        success: false,
        message: "Los campos nombre, cedula, telefono y estado son obligatorios",
      });
    }

    const nuevoTecnico = await prisma.tecnico.create({
      data: {
        nombre,
        cedula,
        telefono,
        estado,
        especialidad: especialidad || null, // opcional
      },
    });

    return res.status(201).json({
      success: true,
      message: "Técnico creado correctamente",
      data: nuevoTecnico,
    });
  } catch (error) {
    console.error("Error al crear el técnico: ", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor",
    });
  }
};