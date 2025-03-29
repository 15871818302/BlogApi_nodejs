import { ServerApiVersion, MongoClient } from "mongodb";
import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import { initializeIndexes } from "@/models";

// 加载环境变量
config();

// 数据库配置
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/blog-api";
const dbName = process.env.MONGODB_DB_NAME || "blog_db";

// 创建 mongodb 客户端
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  ssl: true,
  tls: true,
  retryWrites: true,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
});

// 设置数据库连接状态
let isConnected = false;

// 数据库连接
export async function connectToDatabase() {
  if (isConnected) {
    console.log("数据库已连接");
    return { client, db: client.db(dbName) };
  }

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("已成功连接到 MongoDb 数据库");

    // 初始化集合索引
    const db = client.db(dbName);
    await initializeIndexes(db);

    isConnected = true;
    return { client, db: client.db(dbName) };
  } catch (error) {
    console.error("数据库连接失败: ", error);
    throw error;
  }
}

// 关闭数据库连接
export async function closeDatabaseConnection() {
  if (!isConnected) {
    return;
  }

  try {
    await client.close();
    isConnected = false;
    console.log("数据库连接已关闭");
  } catch (error) {
    console.error("关闭数据库连接时出错: ", error);
    throw error;
  }
}

// 获取数据库实例
export function getDb() {
  if (!isConnected) {
    console.log("数据库尚未连接，请稍后。。。");
  }
  return client.db(dbName);
}

// 中间件处理
export function databaseMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.db = getDb();
    next();
  } catch (error) {
    console.error("数据库中间件错误: ", error);
    res.status(500).json({
      success: false,
      message: "数据库连接失败",
    });
  }
}

export default {
  url: process.env.MONGODB_URI || "mongodb://localhost:27017/blog-api",
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};
