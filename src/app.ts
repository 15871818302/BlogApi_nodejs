import express, { Application } from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { getDb } from "./config/database";
import router from "./router";
import { specs } from "./config/swagger";
// 类型扩展
declare global {
  namespace Express {
    interface Request {
      db: any;
    }
  }
}

const app: Application = express();

// 启动压缩
app.use(compression());

// 中间件
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false, // 允许Swagger UI加载资源
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// API文档路由
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
// API路由
app.use("/api", router);
// 挂载数据库实例
app.use((req, res, next) => {
  req.db = getDb();
  next();
});

export default app;
