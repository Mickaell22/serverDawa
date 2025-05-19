import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
Hola
// todos losd respuestos
export const getAllRepuestos = async (req, res) => {
  try {
    const repuestos = await prisma.repuesto.findMany({
      where: {
        estado: true
      },
      orderBy: {
        nombre: 'asc'
      }
    });
    
    return res.status(200).json({
      success: true,
      message: "Repuestos obtenidos correctamente",
      data: repuestos
    });
  } catch (error) {
    console.error("Error al obtener el repuesto: ", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};

// repeustro por id
export const getRepuestoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const repuesto = await prisma.repuesto.findUnique({
      where: {
        id: parseInt(id)
      }
    });
    
    if (!repuesto) {
      return res.status(404).json({
        success: false,
        message: "Repuesto no encontrado"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: repuesto
    });
  } catch (error) {
    console.error("Error al obtener repuesto: ", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};

// nuevo repuesto
export const createRepuesto = async (req, res) => {
  try {
    const { codigo, nombre, precio, cantidad, proveedor, categoria, ubicacion } = req.body;
    
    // Validar campos requeridos
    if (!codigo || !nombre || !precio || !cantidad) {
      return res.status(400).json({
        success: false,
        message: "Campos obligatorios *(Codigo, Nombre, Precio, Cantidad)"
      });
    }
    
    // Verificar si existe el repuesto
    const existingRepuesto = await prisma.repuesto.findUnique({
      where: {
        codigo: codigo
      }
    });
    
    if (existingRepuesto) {
      return res.status(400).json({
        success: false,
        message: "Ya existe este codigo registrado"
      });
    }
    
    const newRepuesto = await prisma.repuesto.create({
      data: {
        codigo,
        nombre,
        precio: parseFloat(precio),
        cantidad: parseInt(cantidad),
        proveedor,
        categoria,
        ubicacion,
        estado: true
      }
    });
    
    return res.status(201).json({
      success: true,
      message: "Repuesto creado correctamente",
      data: newRepuesto
    });
  } catch (error) {
    console.error("Error al crear repuesto: ", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};

// Actualizar un repuesto
export const updateRepuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nombre, precio, cantidad, proveedor, categoria, ubicacion } = req.body;
    
    // Validar campos requeridos
    if (!codigo || !nombre || !precio || !cantidad) {
      return res.status(400).json({
        success: false,
        message: "Campos obligatorios *(Codigo, Nombre, Precio, Cantidad)"
      });
    }
    
    // Verificar si existe el repuesto
    const existingRepuesto = await prisma.repuesto.findUnique({
      where: {
        id: parseInt(id)
      }
    });
    
    if (!existingRepuesto) {
      return res.status(404).json({
        success: false,
        message: "Repuesto no encontrado"
      });
    }
    
    // Verificar si el código ya está en uso por otro repuesto
    if (codigo !== existingRepuesto.codigo) {
      const repuestoWithSameCode = await prisma.repuesto.findUnique({
        where: {
          codigo: codigo
        }
      });
      
      if (repuestoWithSameCode) {
        return res.status(400).json({
          success: false,
          message: "Ya existe otro repuesto con este código"
        });
      }
    }
    
    // Actualizar el repuesto
    const updatedRepuesto = await prisma.repuesto.update({
      where: {
        id: parseInt(id)
      },
      data: {
        codigo,
        nombre,
        precio: parseFloat(precio),
        cantidad: parseInt(cantidad),
        proveedor,
        categoria,
        ubicacion
      }
    });
    
    return res.status(200).json({
      success: true,
      message: "Repuesto actualizado correctamente",
      data: updatedRepuesto
    });
  } catch (error) {
    console.error("Error al actualizar repuesto:", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};

// Eliminar un repuesto (logico)
export const deleteRepuesto = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el repuesto existe
    const existingRepuesto = await prisma.repuesto.findUnique({
      where: {
        id: parseInt(id)
      }
    });
    
    if (!existingRepuesto) {
      return res.status(404).json({
        success: false,
        message: "Repuesto no encontrado"
      });
    }
    
    // eliminado logico
    await prisma.repuesto.update({
      where: {
        id: parseInt(id)
      },
      data: {
        estado: false
      }
    });
    
    return res.status(200).json({
      success: true,
      message: "Repuesto eliminado correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar repuesto:", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};