import { ObjectId } from "mongodb";

// 文章状态枚举
export enum PostStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

// SEO 信息接口
export interface ISEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
}

// 文章接口
export interface IPost {
  _id?: ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author: ObjectId;
  categories: ObjectId[];
  tags: string[];
  status: PostStatus;
  commentEnabled: boolean;
  viewCount: number;
  seo?: ISEO;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 创建文章对象
export function createPost(postData: Partial<IPost>): Omit<IPost, "_id"> {
  const now = new Date();

  return {
    title: postData.title || "",
    slug: postData.slug || "",
    content: postData.content || "",
    excerpt: postData.excerpt || "",
    featuredImage: postData.featuredImage,
    author: postData.author || new ObjectId(),
    categories: postData.categories || [],
    tags: postData.tags || [],
    status: postData.status || PostStatus.DRAFT,
    commentEnabled: postData.commentEnabled ?? true,
    viewCount: postData.viewCount || 0,
    seo: postData.seo,
    publishedAt:
      postData.status === PostStatus.PUBLISHED
        ? postData.publishedAt || now
        : undefined,
    createdAt: postData.createdAt || now,
    updatedAt: now,
  };
}

// 文章集合名称
export const COLLECTION_NAME = "posts";

// 创建索引函数
export async function createIndexes(db: any) {
  const collection = db.collection(COLLECTION_NAME);

  await collection.createIndexes([
    { key: { slug: 1 }, unique: true },
    { key: { author: 1 } },
    { key: { categories: 1 } },
    { key: { tags: 1 } },
    { key: { status: 1 } },
    { key: { publishedAt: -1 } },
  ]);
}
