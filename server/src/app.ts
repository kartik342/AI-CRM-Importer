import express from "express";
import cors from "cors";
import importRoutes from "./routes/import.route";

const app = express();

app.use(cors());
app.use(express.json());

// Register routes
app.use("/api", importRoutes);

export default app;