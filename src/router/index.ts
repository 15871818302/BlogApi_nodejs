/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: 身份认证相关接口
 *   - name: Posts
 *     description: 文章管理相关接口
 *   - name: Categories
 *     description: 分类管理相关接口
 *   - name: Comments
 *     description: 评论管理相关接口
 *   - name: Users
 *     description: 用户管理相关接口
 *   - name: Settings
 *     description: 系统设置相关接口
 *   - name: Media
 *     description: 媒体资源管理相关接口
 */
import { Router } from "express";
import authRoutes from "./authRoutes";
import postRoutes from "./postRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);

export default router;
