import { ObjectId } from "mongodb";
import { getDb } from "@/config/database";
import { ICategory, COLLECTION_NAME } from "@/models/Category";

class CategoryRepository {
  private collection;

  constructor() {
    this.collection = getDb().collection(COLLECTION_NAME);
  }

  // 查找所有分类
  async findAll(): Promise<ICategory[]> {
    return (await this.collection.find().toArray()) as ICategory[];
  }

  // 根据ID查找分类
  async findById(id: string): Promise<ICategory | null> {
    const result = await this.collection.findOne({ _id: new ObjectId(id) });
    return result as ICategory | null;
  }

  // 创建分类
  async create(category: ICategory): Promise<ICategory> {
    const result = await this.collection.insertOne(category);
    return { ...category, _id: result.insertedId } as ICategory;
  }

  // 更新分类
  async update(
    id: string,
    category: Partial<ICategory>
  ): Promise<ICategory | null> {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: category }
    );
    if (result.modifiedCount === 0) {
      return null;
    }
    return { ...category, _id: new ObjectId(id) } as ICategory;
  }
}

export default new CategoryRepository();
