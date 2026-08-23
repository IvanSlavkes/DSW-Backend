import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import fieldRoutes from "./routes/field.routes.js"
import matchRoutes from "./routes/match.routes.js"
import userRoutes from "./routes/user.routes.js"
import matchTeamRoutes from "./routes/match-team.routes.js"
import teamPositionRoutes from "./routes/team-position.routes.js"
import friendRequestRoutes from "./routes/friend-request.routes.js"
import notificationRoutes from "./routes/notification.routes.js"
import calificationRoutes from "./routes/rating.routes.js"


const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

app.use("/fields", fieldRoutes);
app.use("/matches", matchRoutes);
app.use("/users", userRoutes);
app.use("/match-teams", matchTeamRoutes);
app.use("/team-positions", teamPositionRoutes);
app.use("/friend-requests", friendRequestRoutes);
app.use("/notifications", notificationRoutes);
app.use("/ratings", calificationRoutes)


// Ruta de prueba, para confirmar que el server levanta
app.get('/', (req, res) => {
  res.json({ mensaje: 'API DSW funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
