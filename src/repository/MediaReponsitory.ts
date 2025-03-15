import { ObjectId } from "mongodb";
import { getDb } from "@/config/database";
import { IMedia, COLLECTION_NAME } from "@/models/Media";

class MediaRepository {
  private collection;

  constructor() {
    this.collection = getDb().collection(COLLECTION_NAME);
  }

  // 查找所有媒体
  async findAll(): Promise<IMedia[]> {
    return (await this.collection.find().toArray()) as IMedia[];
  }

  // 根据ID查找媒体
  async findById(id: string): Promise<IMedia | null> {
    const result = await this.collection.findOne({ _id: new ObjectId(id) });
    return result as IMedia | null;
  }

  // 创建媒体
  async create(media: IMedia): Promise<IMedia> {
    const result = await this.collection.insertOne(media);
    return { ...media, _id: result.insertedId } as IMedia;
  }
}

export default new MediaRepository();
