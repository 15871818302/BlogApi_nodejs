import cluster from "cluster";
import os from "os";
import app from "./app";
import { connectToDatabase, closeDatabaseConnection } from "./config/database";

const PORT = process.env.PORT || 3000;

// 根据环境变量来判断是否启动集群模式
const ENABLE_CLUSTER = process.env.ENABLE_CLUSTER === "true";

// 根据 render 资源限制，设置最大进程数
const WORKERS = process.env.NODE_ENV === "production" ? 2 : os.cpus().length;

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

// 主进程和工作进程区分
if (cluster.isPrimary && ENABLE_CLUSTER) {
  console.log(`主进程 ${process.pid} 正在运行`);
  console.log(`工作进程数: ${WORKERS}`);

  // 创建工作进程
  for (let i = 0; i < WORKERS; i++) {
    cluster.fork();
  }

  // 监听工作进程退出事件
  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `工作进程 ${worker.process.pid} 已退出, 退出码: ${code}, 信号: ${signal}`
    );
    // 如果工作进程异常退出，重新启动一个新的工作进程
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log("重新启动工作进程");
      cluster.fork();
    }
  });

  // 处理主进程终止
  const gracefulMasterShutdown = () => {
    console.log("主进程正在关闭");
    for (const id in cluster.workers) {
      cluster.workers[id]?.kill("SIGTERM");
    }

    // 给进程一些时间来关闭
    setTimeout(() => {
      console.log("主进程已关闭");
      process.exit(0);
    }, 5000);
  };

  // 监听主进程终止信号
  process.on("SIGTERM", gracefulMasterShutdown);
  process.on("SIGINT", gracefulMasterShutdown);
} else {
  if (ENABLE_CLUSTER && !cluster.isPrimary) {
    console.log(`工作进程 ${process.pid} 已启动`);
  } else {
    console.log(`单进程模式，进程 ${process.pid} 正在运行`);
  }
  // 工作进程直接启动服务器
  startServer();
}

export default app;
