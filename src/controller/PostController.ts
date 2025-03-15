import { Request, Response, NextFunction } from "express";
import PostService from "@/service/PostService";
import { InternalServerError } from "@/errors";
import { IPost } from "@/models/Post";

export class PostController {
  /**
   * 创建文章
   * @route POST /api/posts
   * @param {string} title.required - 文章标题
   * @param {string} content.required - 文章内容
   * @param {string} author.required - 作者ID
   */
  static async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      // 获取请求数据
      const postData: Partial<IPost> = req.body;

      // 获取当前用户 Id
      const authorId = req.user?.id || "";

      // 验证必要字段
      if (!postData.title) {
        throw new InternalServerError("文章标题不能为空");
      }

      if (!postData.content) {
        throw new InternalServerError("文章内容不能为空");
      }

      // 调用服务层方法
      const post = await PostService.createPost(postData, authorId);

      // 返回结果
      res.status(201).json({
        success: true,
        message: "文章创建成功",
        code: 0,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }
}
