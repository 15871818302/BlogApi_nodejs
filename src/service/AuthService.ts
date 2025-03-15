import jwt from "jsonwebtoken";
import UserRepository from "@/repository/UserRepository";
import { comparePassword, hashPassword, IUser } from "@/models/User";
import config from "@/config";
import { InternalServerError, UnauthorizedError } from "@/errors";

class AuthService {
  // 生成 jwt 令牌
  private generateToken(user: Partial<IUser>) {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      config.jwtSecret,
      {
        expiresIn: "7d",
      }
    );
  }
  // 清理用户敏感信息
  private sanitizeUser(user: Partial<IUser>) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  // 登录
  async login(email: string, password: string) {
    // 查找用户
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("用户不存在");
    }

    // 验证密码
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("密码错误");
    }

    // 生成令牌
    const token = this.generateToken(user);

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  // 用户注册
  async register(userData: {
    username: string;
    email: string;
    password: string;
    displayName?: string;
  }) {
    // 检查邮箱是否存在
    const existingEmail = await UserRepository.findByEmail(userData.email);
    if (existingEmail) {
      throw new InternalServerError("该邮箱已被注册");
    }

    // 检查用户名是否存在
    const existingUsername = await UserRepository.findByUsername(
      userData.username
    );
    if (existingUsername) {
      throw new InternalServerError("该用户名已被占用");
    }

    // 创建新用户
    const hashedPassword = await hashPassword(userData.password);

    const newUser = await UserRepository.create({
      ...userData,
      password: hashedPassword,
      role: "user",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      displayName: userData.displayName || userData.username,
    });

    // 生成令牌
    const token = this.generateToken(newUser);

    return {
      token,
      user: this.sanitizeUser(newUser),
    };
  }
}

export default new AuthService();
