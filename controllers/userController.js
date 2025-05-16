import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.usuario.findMany();
    
    return res.status(200).json({
      success: true,
      message: "Usuarios obtenidos correctamente",
      data: users
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.usuario.findUnique({
      where: {
        id: parseInt(id)
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }
    
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    
    // Validar que se enviaron todos los datos
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos"
      });
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: {
        email: email
      }
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado"
      });
    }
    
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear el usuario
    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        estado: true
      }
    });
    
    return res.status(201).json({
      success: true,
      message: "Usuario creado correctamente",
      data: newUser
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, estado } = req.body;
    
    // Verificar si el usuario existe
    const existingUser = await prisma.usuario.findUnique({
      where: {
        id: parseInt(id)
      }
    });
    
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }
    
    // Preparar datos para actualizar
    const updateData = {};
    
    if (nombre) updateData.nombre = nombre;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (estado !== undefined) updateData.estado = estado;
    
    // Actualizar el usuario
    const updatedUser = await prisma.usuario.update({
      where: {
        id: parseInt(id)
      },
      data: updateData
    });
    
    return res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente",
      data: updatedUser
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el usuario existe
    const existingUser = await prisma.usuario.findUnique({
      where: {
        id: parseInt(id)
      }
    });
    
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }
    
    // Eliminar el usuario
    await prisma.usuario.delete({
      where: {
        id: parseInt(id)
      }
    });
    
    return res.status(200).json({
      success: true,
      message: "Usuario eliminado correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};

// Login de usuario
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar que se enviaron los datos necesarios
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos"
      });
    }
    
    // Buscar el usuario por email
    const user = await prisma.usuario.findUnique({
      where: {
        email: email
      }
    });
    
    // Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }
    
    // Verificar si el usuario está activo
    if (!user.estado) {
      return res.status(401).json({
        success: false,
        message: "Usuario inactivo"
      });
    }
    
    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta"
      });
    }
    
    // Si todo está bien, devolver información del usuario (sin la contraseña)
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};
// 