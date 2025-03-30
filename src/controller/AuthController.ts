import { Request, Response, NextFunction } from "express";
import AuthService from "@/service/AuthService";
import { InternalServerError, UnauthorizedError } from "@/errors";

export class AuthController {
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: 用户登录
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: 用户邮箱
   *               password:
   *                 type: string
   *                 format: password
   *                 description: 用户密码
   *     responses:
   *       200:
   *         description: 登录成功
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: 登录成功
   *                 token:
   *                   type: string
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: 请求参数错误
   *       401:
   *         description: 登录失败，邮箱或密码错误
   *       500:
   *         description: 服务器错误
   */
  /**
   * 登录
   * @route POST /api/auth/login
   * @param {string} email.required - 用户邮箱
   * @param {string} password.required - 用户密码
   * @returns {Object} 用户信息和token
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      // 验证请求数据
      if (!email || !password) {
        throw new UnauthorizedError("邮箱和密码不能为空");
      }

      // 调用服务层方法
      const result = await AuthService.login(email, password);

      // 返回结果
      res.json({
        success: true,
        message: "登录成功",
        code: 0,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: 用户注册
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - email
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *                 description: 用户名
   *               email:
   *                 type: string
   *                 format: email
   *                 description: 用户邮箱
   *               password:
   *                 type: string
   *                 format: password
   *                 description: 用户密码
   *               displayName:
   *                 type: string
   *                 description: 显示名称
   *     responses:
   *       201:
   *         description: 注册成功
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: 注册成功
   *                 token:
   *                   type: string
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: 请求参数错误
   *       500:
   *         description: 服务器错误
   */
  /**
   * 注册
   * @route POST /api/auth/register
   * @param {string} username.required - 用户名
   * @param {string} email.required - 用户邮箱
   * @param {string} password.required - 用户密码
   */

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password, displayName } = req.body;
      // 验证请求数据
      if (!username || !email || !password) {
        throw new InternalServerError("用户名、邮箱和密码不能为空");
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new InternalServerError("邮箱格式不正确");
      }

      // 验证密码强度
      if (password.length < 6) {
        throw new InternalServerError("密码长度不能小于6位");
      }

      // 调用服务层方法
      const result = await AuthService.register({
        username,
        email,
        password,
        displayName,
      });

      // 返回结果
      res.status(201).json({
        success: true,
        message: "注册成功",
        code: 0,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取当前用户信息
   * @route GET /api/auth/me
   */
  // static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const user = req.user;

  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
