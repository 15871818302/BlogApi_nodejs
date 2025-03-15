import { ObjectId } from "mongodb";
import { getDb } from "@/config/database";
import { IComment, COLLECTION_NAME } from "@/models/Comment";

class CommentRepository {
  private collection;

  constructor() {
    this.collection = getDb().collection(COLLECTION_NAME);
  }

  // 返回当前文章的评论
  async findByPostId(postId: string): Promise<IComment[]> {
    return (await this.collection
      .find({ postId: new ObjectId(postId) })
      .toArray()) as IComment[];
  }

  // 创建评论
  async create(comment: IComment): Promise<IComment> {
    const result = await this.collection.insertOne(comment);
    return { ...comment, _id: result.insertedId } as IComment;
  }
}

export default new CommentRepository();
