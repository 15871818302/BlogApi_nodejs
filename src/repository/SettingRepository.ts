import { ObjectId } from "mongodb";
import { getDb } from "@/config/database";
import { ISetting, COLLECTION_NAME } from "@/models/Setting";

class SettingRepository {
  private collection;

  constructor() {
    this.collection = getDb().collection(COLLECTION_NAME);
  }

  // 查找所有配置
  async findAll(): Promise<ISetting[]> {
    return (await this.collection.find().toArray()) as ISetting[];
  }

  // 根据key查找配置
  async findByKey(key: string): Promise<ISetting | null> {
    const result = await this.collection.findOne({ key });
    return result as ISetting | null;
  }

  // 新增配置
  async create(setting: ISetting): Promise<ISetting> {
    const result = await this.collection.insertOne(setting);
    return { ...setting, _id: result.insertedId } as ISetting;
  }

  // 更新配置
  async update(
    key: string,
    setting: Partial<ISetting>
  ): Promise<ISetting | null> {
    const result = await this.collection.updateOne({ key }, { $set: setting });
    if (result.modifiedCount === 0) {
      return null;
    }
    return { ...setting, _id: new ObjectId(key) } as ISetting;
  }

  // 删除配置
  async delete(key: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ key });
    return result.deletedCount > 0;
  }
}

export default new SettingRepository();
