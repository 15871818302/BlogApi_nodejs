import { ObjectId } from "mongodb";
import { getDb } from "@/config/database";
import { IUser, hashPassword, COLLECTION_NAME } from "@/models/User";

// 用户仓库类
class UserRepository {
  private collection;

  constructor() {
    this.collection = getDb().collection(COLLECTION_NAME);
  }

  // 根据ID查找用户
  async findById(id: string): Promise<IUser | null> {
    return await this.collection.findOne<IUser>({ _id: new ObjectId(id) });
  }

  // 根据用户名查找用户
  async findByUsername(username: string): Promise<IUser | null> {
    return await this.collection.findOne<IUser>({ username });
  }

  // 根据邮箱查找用户
  async findByEmail(email: string): Promise<IUser | null> {
    return await this.collection.findOne<IUser>({ email });
  }

  // 创建用户
  async create(userData: Omit<IUser, "_id">): Promise<IUser> {
    // 处理加密
    const password = await hashPassword(userData.password);
    const result = await this.collection.insertOne({
      ...userData,
      password,
    });

    return {
      _id: result.insertedId,
      ...userData,
    };
  }
}

export default new UserRepository();
