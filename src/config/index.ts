import dotenv from "dotenv";
import path from "path";
import database from "./database";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export default {
  port: process.env.PORT || 3000,
  database,
  jwtSecret: process.env.JWT_SECRET || "secret",
  logging: {
    level: process.env.LOGGING_LEVEL || "info",
    filename: process.env.LOGGING_FILENAME || "logs/app.log",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: process.env.CORS_METHODS || "GET,POST,PUT,DELETE",
    allowedHeaders:
      process.env.CORS_ALLOWED_HEADERS || "Content-Type,Authorization",
  },
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET || "secret",
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    },
  },
};
