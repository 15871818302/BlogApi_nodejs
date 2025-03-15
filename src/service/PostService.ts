import PostRepository from "@/repository/PostRepository";
import { IPost, PostStatus } from "@/models/Post";
import UserRepository from "@/repository/UserRepository";
import CategoryReponsitory from "@/repository/CategoryReponsitory";
import { ObjectId } from "mongodb";

class PostService {
  // 创建文章
  async createPost(postData: Partial<IPost>, authorId: string) {
    // 检查作者是否存在
    const author = await UserRepository.findById(authorId);
    if (!author) {
      throw new Error("作者不存在");
    }

    // 验证分类是否存在
    if (postData.categories && postData.categories.length > 0) {
      for (const categoryId of postData.categories) {
        const category = await CategoryReponsitory.findById(
          categoryId.toString()
        );
        if (!category) {
          throw new Error("暂无该分类");
        }
      }
    }

    // 创建
    const post = await PostRepository.create({
      ...postData,
      author: new ObjectId(authorId),
      title: postData.title || "",
      slug: postData.slug || "",
      content: postData.content || "",
      status: postData.status || PostStatus.DRAFT,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      categories: postData.categories || [],
      tags: postData.tags || [],
      commentEnabled: postData.commentEnabled || false,
      publishedAt: postData.publishedAt || undefined,
      seo: postData.seo || undefined,
    });

    return post;
  }
}

export default new PostService();
