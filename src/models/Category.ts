import { ObjectId } from "mongodb";

// 分类接口
export interface ICategory {
  _id?: ObjectId;
  name: string;
  slug: string;
  description?: string;
  parent?: ObjectId;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

// 创建分类对象
export function createCategory(
  categoryData: Partial<ICategory>
): Omit<ICategory, "_id"> {
  const now = new Date();

  return {
    name: categoryData.name || "",
    slug: categoryData.slug || "",
    description: categoryData.description || "",
    parent: categoryData.parent,
    order: categoryData.order || 0,
    createdAt: categoryData.createdAt || now,
    updatedAt: now,
  };
}

// 分类集合名称
export const COLLECTION_NAME = "categories";

// 创建索引函数
export async function createIndexes(db: any) {
  const collection = db.collection(COLLECTION_NAME);

  await collection.createIndexes([
    { key: { slug: 1 }, unique: true },
    { key: { parent: 1 } },
    { key: { order: 1 } },
  ]);
}
