import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import config from './config/env.js';
import userRoutes from './routes/userRoutes.js';
import repuestoRoutes from './routes/repuestoRoutes.js';
import routes_orders from './routes/ordersRoutes.js'; 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging para desarrollo
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rutas
app.use('/api', userRoutes);
app.use('/api', repuestoRoutes); 
app.use('/api', routes_orders); 

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar servidor
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});