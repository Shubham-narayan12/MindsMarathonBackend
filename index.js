// Load environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

//DB Connection
import connectDb from "./config/db.js";

//Routes Imports
import schoolRoutes from "./routes/schoolRoutes.js";
import studentRoutes from "./routes/studentsRoutes.js";

// Connect to database
connectDb();

const app = express();
const port = process.env.PORT || 8080;

// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // local development
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies
  })
);

//MIDDLEWARE
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

//Routes
app.use("/api/school", schoolRoutes);
app.use("/api/student", studentRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Minds Marathon API is running...");
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
