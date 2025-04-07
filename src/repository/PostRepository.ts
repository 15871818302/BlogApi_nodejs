import { ObjectId } from "mongodb";
import { getDb } from "@/config/database";
import { IPost, COLLECTION_NAME } from "@/models/Post";
import cache from "@/utils/cache";

// 帖子仓库类
class PostRepository {
  private collection;

  constructor() {
    this.collection = getDb().collection(COLLECTION_NAME);
  }

  // 根据某个元素查找
  async findById(id: string): Promise<IPost | null> {
    const cacheKey = `post:${id}`;
    const cachedPost = cache.get<IPost>(cacheKey);
    if (cachedPost) {
      return cachedPost;
    }
    const post = await this.collection.findOne<IPost>({
      _id: new ObjectId(id),
    });
    if (post) {
      cache.set(cacheKey, post);
    }
    return post;
  }

  async findBySlug(slug: string): Promise<IPost | null> {
    const cacheKey = `post:slug:${slug}`;
    const cachedPost = cache.get<IPost>(cacheKey);
    if (cachedPost) {
      return cachedPost;
    }
    const post = await this.collection.findOne<IPost>({ slug });
    if (post) {
      cache.set(cacheKey, post);
      // 用id缓存一份
      cache.set(`post:${post._id}`, post);
    }
    return post;
  }

  // 新增
  async create(postData: Omit<IPost, "_id">): Promise<IPost> {
    const result = await this.collection.insertOne({
      ...postData,
    });

    const newPost = {
      _id: result.insertedId,
      ...postData,
    };

    // 添加到缓存
    cache.set(`post:${newPost._id}`, newPost);
    if (newPost.slug) {
      cache.set(`post:slug:${newPost.slug}`, newPost);
    }

    // 清除列表缓存
    cache.del("posts:list:*");

    return newPost;
  }

  // 修改
  async update(
    id: string,
    postData: Omit<IPost, "_id">
  ): Promise<IPost | null> {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: postData }
    );

    if (result.modifiedCount === 0) {
      return null;
    }

    return {
      _id: new ObjectId(id),
      ...postData,
    };
  }

  // 删除
  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // 分页查询
  async findPaginated(page: number, limit: number): Promise<IPost[]> {
    const skip = (page - 1) * limit;
    const posts = (await this.collection
      .find()
      .skip(skip)
      .limit(limit)
      .toArray()) as IPost[];
    return posts.map((post) => ({
      ...post,
    }));
  }
}

export default new PostRepository();
