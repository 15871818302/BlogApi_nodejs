import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "@/errors";
import config from "@/config";

// 扩展Request类型
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        displayName: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 从请求头中获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError("请先登录");
    }

    // 验证 token 格式
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new UnauthorizedError("请先登录");
    }

    // 验证 token
    const token = parts[1];

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded as any;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError("无效的 token");
    } else {
      next(error);
    }
  }
};

// 角色授权中间件
export const authRoleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      throw new UnauthorizedError("您没有权限访问此资源");
    }

    if (!req.user) {
      throw new UnauthorizedError("未认证的用户");
    }

    next();
  };
};
