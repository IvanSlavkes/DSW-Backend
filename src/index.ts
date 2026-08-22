import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import fieldRoutes from "./routes/field.routes.js"
import partidoRoutes from "./routes/partido.routes.js"
import usuariosRoutes from "./routes/usuario.routes.js"
import equipoPartidoRoutes from "./routes/equipopartido.routes.js"
import posicionEnEquipoRoutes from "./routes/posicionenequipo.routes.js"
import solAmistadRoutes from "./routes/solamistad.routes.js"
import notificacionRoutes from "./routes/notificacion.routes.js"
import calificacionRoutes from "./routes/calificacion.routes.js"


const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

app.use("/fields", fieldRoutes);
app.use("/partidos", partidoRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/equipos-partido", equipoPartidoRoutes);
app.use("/posiciones-equipo", posicionEnEquipoRoutes);
app.use("/solicitudes-amistad", solAmistadRoutes);
app.use("/notificaciones", notificacionRoutes);
app.use("/calificaciones", calificacionRoutes)


// Ruta de prueba, para confirmar que el server levanta
app.get('/', (req, res) => {
  res.json({ mensaje: 'API DSW funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
