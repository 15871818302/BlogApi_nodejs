import { ObjectId } from "mongodb";

// 评论状态枚举
export enum CommentStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  SPAM = "spam",
}

// 评论接口
export interface IComment {
  _id?: ObjectId;
  postId: ObjectId;
  parent?: ObjectId;
  author: {
    name: string;
    email: string;
    website?: string;
    userId?: ObjectId;
  };
  content: string;
  status: CommentStatus;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 创建评论对象
export function createComment(
  commentData: Partial<IComment>
): Omit<IComment, "_id"> {
  const now = new Date();

  return {
    postId: commentData.postId || new ObjectId(),
    parent: commentData.parent,
    author: {
      name: commentData.author?.name || "Anonymous",
      email: commentData.author?.email || "",
      website: commentData.author?.website,
      userId: commentData.author?.userId,
    },
    content: commentData.content || "",
    status: commentData.status || CommentStatus.PENDING,
    ipAddress: commentData.ipAddress,
    userAgent: commentData.userAgent,
    createdAt: commentData.createdAt || now,
    updatedAt: now,
  };
}

// 评论集合名称
export const COLLECTION_NAME = "comments";

// 创建索引函数
export async function createIndexes(db: any) {
  const collection = db.collection(COLLECTION_NAME);

  await collection.createIndexes([
    { key: { postId: 1 } },
    { key: { parent: 1 } },
    { key: { "author.userId": 1 } },
    { key: { status: 1 } },
    { key: { createdAt: -1 } },
  ]);
}
