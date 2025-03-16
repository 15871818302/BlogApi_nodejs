import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { getDb } from "./config/database";
import router from "./router";
// 类型扩展
declare global {
  namespace Express {
    interface Request {
      db: any;
    }
  }
}

const app: Application = express();

// 中间件
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
// 挂载数据库实例
app.use((req, res, next) => {
  req.db = getDb();
  next();
});

export default app;
