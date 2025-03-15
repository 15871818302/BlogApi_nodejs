import { ObjectId } from "mongodb";
import * as argon2 from "argon2";

// 用户接口
export interface IUser {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  role: "admin" | "user" | "guest";
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 密码加密
export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

// 密码验证
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await argon2.verify(hash, password);
}

// 创建用户对象
export function createUser(userData: Partial<IUser>): Omit<IUser, "_id"> {
  const now = new Date();

  return {
    username: userData.username || "",
    email: userData.email || "",
    password: userData.password || "",
    displayName: userData.displayName || userData.username || "",
    role: userData.role || "guest",
    avatar: userData.avatar || "",
    bio: userData.bio || "",
    isActive: userData.isActive || true,
    lastLogin: userData.lastLogin || undefined,
    createdAt: userData.createdAt || now,
    updatedAt: now,
  };
}

// 用户集合名称
export const COLLECTION_NAME = "users";

// 创建索引函数
export async function createIndexes(db: any) {
  const collection = db.collection(COLLECTION_NAME);

  await collection.createIndexes([
    {
      key: { username: 1 },
      unique: true,
    },
    {
      key: { email: 1 },
      unique: true,
    },
  ]);
}
