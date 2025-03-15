import app from "./app";
import { connectToDatabase, closeDatabaseConnection } from "./config/database";

const PORT = process.env.PORT || 3000;

// 启动服务器
async function startServer() {
  try {
    // 连接数据库
    await connectToDatabase();

    // 启动应用服务器
    const server = app.listen(PORT, () => {
      console.log(`服务器运行在端口 ${PORT}`);
    });

    // 处理进程终止
    const gracefulShutdown = async () => {
      console.log("正在关闭服务器");
      server.close(async () => {
        console.log("服务器已关闭");
        await closeDatabaseConnection();
        process.exit(0);
      });
    };

    // 监听终止信号
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);

    return server;
  } catch (error) {
    console.error("服务器启动失败: ", error);
    process.exit(1);
  }
}

startServer();

export default app;
