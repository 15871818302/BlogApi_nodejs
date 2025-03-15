import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "@/errors";

export const validatePostData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, content } = req.body;
  const errors = [];
  if (!title || title.trim() === "") {
    errors.push("标题不能为空");
  }

  if (!content || content.trim() === "") {
    errors.push("内容不能为空");
  }

  if (errors.length > 0) {
    return next(new BadRequestError(errors.join(", ")));
  }

  next();
};

export const validateLoginData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const errors = [];
  if (!email || email.trim() === "" || !password) {
    errors.push("邮箱和密码不能为空");
  }
  next();
};

export const validateRegisterData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;
  const errors = [];
  if (!username || username.trim() === "") {
    errors.push("用户名不能为空");
  }

  if (!email || email.trim() === "" || !password) {
    errors.push("邮箱和密码不能为空");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("邮箱格式不正确");
    }
  }

  if (!password) {
    errors.push("密码不能为空");
  } else if (password.length < 6) {
    errors.push("密码长度不能小于6位");
  }

  if (errors.length > 0) {
    return next(new BadRequestError(errors.join(", ")));
  }

  next();
};
