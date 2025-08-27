import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5002;
const __dirname = path.resolve();

// ✅ Helmet with a CSP that allows favicon, images, fonts, etc.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https:"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

// 🛠 fallback if Render still injects CSP and add CORP headers
app.use((req, res, next) => {
  res.removeHeader("Content-Security-Policy"); // strip Render's default
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https:; style-src 'self' https: 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' https: data:; object-src 'none'"
  );
  // Add Cross-Origin-Resource-Policy header
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  // Add other helpful headers
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

// middleware
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}

app.use(express.json());
app.use(rateLimiter);

// API routes FIRST - before static files
app.use("/api/notes", notesRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running!" });
});

// Handle favicon.ico requests
app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // No content
});

// serve frontend in production
if (process.env.NODE_ENV === "production") {
  // Serve static files from the frontend dist folder
  const frontendPath = path.join(__dirname, "frontend", "dist");
  app.use(express.static(frontendPath));
  
  // Handle all non-API routes by serving the React app
  app.get("*", (req, res) => {
    // Make sure this doesn't interfere with API routes
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, "index.html"));
    }
  });
} else {
  app.get("/", (req, res) => {
    res.json({ message: "API is running in development mode" });
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("__dirname:", __dirname);
  });
});