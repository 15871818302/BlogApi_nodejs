import { ObjectId } from "mongodb";

// 设置接口
export interface ISetting {
  _id?: ObjectId;
  key: string;
  value: any;
  group: string;
  updatedBy?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// 博客设置接口
export interface IBlogSettings {
  title: string;
  description: string;
  logo?: string;
  favicon?: string;
  postsPerPage: number;
  allowComments: boolean;
  moderateComments: boolean;
  theme: string;
  socialMedia: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  analyticsId?: string;
}

// 创建设置对象
export function createSetting(
  settingData: Partial<ISetting>
): Omit<ISetting, "_id"> {
  const now = new Date();

  return {
    key: settingData.key || "",
    value: settingData.value,
    group: settingData.group || "general",
    updatedBy: settingData.updatedBy,
    createdAt: settingData.createdAt || now,
    updatedAt: now,
  };
}

// 设置集合名称
export const COLLECTION_NAME = "settings";

// 创建索引函数
export async function createIndexes(db: any) {
  const collection = db.collection(COLLECTION_NAME);

  await collection.createIndexes([
    { key: { key: 1 }, unique: true },
    { key: { group: 1 } },
  ]);
}
