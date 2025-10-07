import express, { Express } from "express";
import userRoutes from "./routes/userRoutes";
import reservaRoutes from "./routes/reservaRoutes";
import { setupSwagger } from "./swagger";

const app: Express = express();
const port: number = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Rota de teste geral da API
app.get("/api", (req, res) => {
  res.send("Bem-vindo à API Reserva de Salão de Festas!");
});

// Rotas da API
app.use("/api", userRoutes);
app.use("/api", reservaRoutes);

// Configura o Swagger
setupSwagger(app);

// Inicializa o servidor
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
  console.log(`Swagger disponível em http://localhost:${port}/api-docs`);
});