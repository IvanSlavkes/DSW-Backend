import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import fieldRoutes from "./routes/field.routes.js";
import matchRoutes from "./routes/match.routes.js";
import userRoutes from "./routes/user.routes.js";
import matchTeamRoutes from "./routes/match-team.routes.js";
import teamPositionRoutes from "./routes/team-position.routes.js";
import friendRequestRoutes from "./routes/friend-request.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import calificationRoutes from "./routes/rating.routes.js";
import localityRoutes from "./routes/locality.routes.js";
import authRoutes from "./routes/auth.routes.js";

import verifyToken from "./middleware/auth.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas públicas (no necesitan token)
app.use("/auth", authRoutes); // 👈 login y register

// Rutas protegidas (CRUDs)
app.use("/fields", verifyToken, fieldRoutes);
app.use("/matches", verifyToken, matchRoutes);
app.use("/users", verifyToken, userRoutes);
app.use("/match-teams", verifyToken, matchTeamRoutes);
app.use("/team-positions", verifyToken, teamPositionRoutes);
app.use("/friend-requests", verifyToken, friendRequestRoutes);
app.use("/notifications", verifyToken, notificationRoutes);
app.use("/ratings", verifyToken, calificationRoutes);
app.use("/localities", verifyToken, localityRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API DSW funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
