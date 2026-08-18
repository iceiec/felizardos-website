import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
import { connectDB, ensureDefaultAdmin } from "./config/db";
import apiRoutes from "./routes";

const app = express();

// Middleware
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (env.NODE_ENV === "development") app.use(morgan("dev"));

// Routes
app.use("/api", apiRoutes);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
});

async function start(): Promise<void> {
  await connectDB();
  await ensureDefaultAdmin();
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
  });
}

start();
