import { Request, Response, NextFunction } from "express";
import PostService from "@/service/PostService";
import { InternalServerError } from "@/errors";
import { IPost } from "@/models/Post";

export class PostController {
  /**
   * @swagger
   * /posts:
   *   post:
   *     summary: 创建新文章
   *     tags: [Posts]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - content
   *             properties:
   *               title:
   *                 type: string
   *                 description: 文章标题
   *               content:
   *                 type: string
   *                 description: 文章内容
   *               slug:
   *                 type: string
   *                 description: URL友好的标识符
   *               excerpt:
   *                 type: string
   *                 description: 文章摘要
   *               status:
   *                 type: string
   *                 enum: [draft, published, archived]
   *                 description: 文章状态
   *               categories:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: 分类ID数组
   *               tags:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: 标签数组
   *     responses:
   *       201:
   *         description: 文章创建成功
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: 文章创建成功
   *                 code:
   *                   type: integer
   *                   example: 0
   *                 data:
   *                   $ref: '#/components/schemas/Post'
   *       400:
   *         description: 请求参数错误
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: 未授权
   *       500:
   *         description: 服务器错误
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

  static async getPostsByPage(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const posts = await PostService.getPostsByPage(
        Number(page),
        Number(limit)
      );
      res.status(200).json({
        success: true,
        message: "获取文章列表成功",
        code: 0,
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  }

  // 修改文章
  static async updatePost(req: Request, res: Response, next: NextFunction) {
    try {
      const postData: IPost = req.body;
      const postId = req.params.id;

      // 调用服务层方法
      const post = await PostService.updatePost(postData, postId);

      // 返回结果
      res.status(200).json({
        success: true,
        message: "文章更新成功",
        code: 0,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }
  // 删除文章
  static async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = req.params.id;

      // 调用服务层方法
      await PostService.deletePost(postId);

      // 返回结果
      res.status(200).json({
        success: true,
        message: "文章删除成功",
        code: 0,
      });
    } catch (error) {
      next(error);
    }
  }
}
