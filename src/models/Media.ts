import { ObjectId } from "mongodb";

// 媒体类型枚举
export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  DOCUMENT = "document",
  AUDIO = "audio",
  OTHER = "other",
}

// 媒体接口
export interface IMedia {
  _id?: ObjectId;
  filename: string;
  originalName: string;
  mimeType: string;
  type: MediaType;
  size: number;
  url: string;
  path: string;
  altText?: string;
  caption?: string;
  width?: number;
  height?: number;
  uploadedBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// 创建媒体对象
export function createMedia(mediaData: Partial<IMedia>): Omit<IMedia, "_id"> {
  const now = new Date();

  return {
    filename: mediaData.filename || "",
    originalName: mediaData.originalName || "",
    mimeType: mediaData.mimeType || "application/octet-stream",
    type: mediaData.type || MediaType.OTHER,
    size: mediaData.size || 0,
    url: mediaData.url || "",
    path: mediaData.path || "",
    altText: mediaData.altText || "",
    caption: mediaData.caption,
    width: mediaData.width,
    height: mediaData.height,
    uploadedBy: mediaData.uploadedBy || new ObjectId(),
    createdAt: mediaData.createdAt || now,
    updatedAt: now,
  };
}

// 媒体集合名称
export const COLLECTION_NAME = "media";

// 创建索引函数
export async function createIndexes(db: any) {
  const collection = db.collection(COLLECTION_NAME);

  await collection.createIndexes([
    { key: { filename: 1 } },
    { key: { type: 1 } },
    { key: { uploadedBy: 1 } },
  ]);
}
