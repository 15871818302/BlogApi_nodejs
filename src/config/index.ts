import database from "./database";

export default {
  port: process.env.PORT || 3000,
  database,
  jwtSecret: process.env.JWT_SECRET || "secret",
};
