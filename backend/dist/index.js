"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({ origin: env_1.env.CLIENT_ORIGIN, credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
if (env_1.env.NODE_ENV === "development")
    app.use((0, morgan_1.default)("dev"));
// Routes
app.use("/api", routes_1.default);
// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
// Global error handler
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: err.message || "Internal server error" });
});
async function start() {
    await (0, db_1.connectDB)();
    await (0, db_1.ensureDefaultAdmin)();
    app.listen(env_1.env.PORT, () => {
        console.log(`Server running on http://localhost:${env_1.env.PORT} [${env_1.env.NODE_ENV}]`);
    });
}
start();
//# sourceMappingURL=index.js.map