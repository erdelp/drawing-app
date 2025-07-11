import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { drawingRoutes } from "./routes/drawings";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/drawings", drawingRoutes);

// Root route - ADD THIS
app.get("/", (req, res) => {
  res.json({
    message: "Drawing App API Server",
    status: "Running",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      drawings: "/api/drawings",
    },
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🎨 API: http://localhost:${PORT}/api/drawings`);
});
