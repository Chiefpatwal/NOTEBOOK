import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet"; // 👈 add helmet

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// ✅ Helmet security middleware with CSP that allows favicon, images, etc.
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
      },
    },
  })
);

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

app.use("/api/notes", notesRoutes);

// serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
